import Button from "@mui/material/Button";
import * as React from "react";
import TextField from "@mui/material/TextField";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import {useReducer} from "react";
import s from "./Form.module.css";
import dayjs from "dayjs";
import {nanoid} from "nanoid";
import {ReactComponent as TrashIcon} from "../../img/trash.svg";
import axios from "axios";

const initialState = {
    title: "",
    description: "",
    date: dayjs().format("DD/MM/YY"),
    time: dayjs().format("hh:mm (a|p)m"),
    edit: false,
    createOrUpdate: null,
};

function reducer(state, action) {
    switch (action.type) {
        case "id":
            return {...state, id: action.payload};
        case "title":
            return {...state, title: action.payload};
        case "description":
            return {...state, description: action.payload};
        case "date":
            return {...state, date: action.payload};
        case "time":
            return {...state, time: action.payload};
        case "edit":
            return {...state, edit: true};
        case "createOrUpdate":
            return {...state, createOrUpdate: dayjs().format("DD.MM.YYYY HH:mm")}
        default:
            return state;
    }
}

export default function Form({setTasks, toggleModal, title, tasks, taskId}) {
    const [state, dispatch] = useReducer(
        reducer,
        taskId ? tasks.find((task) => task.id === taskId) : initialState
    );
    const handleDelete = () => {
        setTasks(tasks.filter((task) => task.id !== taskId));
        toggleModal();

        // На случай перехода на REST API
        // const deleteTask = async () => {
        //     try {
        //         //Если в ответе возвращается удаленный id таски
        //         const result = await axios.delete(`/task${taskId}`);
        //         setTasks(tasks.filter((task) => task.id !== result));
        //     }catch (error) {
        //         throw new Error(error)
        //     }
        // }
        // deleteTask()
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskId) {
            setTasks((prevState) =>
                prevState.map((task) => (task.id === taskId ? state : task))
            );
            toggleModal();
            return;

        //Редактирование существующей таски
        //      const editTask = async (event) => {
        // try {
        //     const result = await axios.patch(/task/${event.id}, event);
        //     return result;
        // } catch (error) {
        //     throw new Error(error)
        // }
        //          editTask()
}

        }

        setTasks((prevState) => [...prevState, state]);
        toggleModal();

        // На случай перехода на REST API
        // const postTask = async () => {
        //     try {
        //         const result = await axios.post('/task', state);
        //         setTasks(result.data)
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // }
        // postTask()

    };

    return (
        <form className={s.form} onSubmit={handleSubmit}>
            <h2 className={s.title}>{title}</h2>
            <TextField
                name="title"
                className={s.input}
                value={state.title}
                onChange={(e) => {
                    const value = e.target.value;
                    dispatch({type: "title", payload: value});
                }}
                label="Title*"
            />
            <TextField
                name="description"
                className={s.input}
                value={state.description}
                id="outlined-textarea"
                label="Description"
                onChange={(e) => {
                    const value = e.target.value;
                    dispatch({type: "description", payload: value});
                }}
                rows={4}
                placeholder="Placeholder"
                multiline
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    name="date"
                    className={s.input}
                    label="Date*"
                    openTo="year"
                    views={["year", "month", "day"]}
                    value={state.date}
                    onChange={(newValue) => {
                        dispatch({type: "date", payload: newValue});
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                    name="time"
                    className={s.input}
                    renderInput={(params) => <TextField {...params} />}
                    value={state.time}
                    label="Time"
                    onChange={(newValue) => {
                        dispatch({type: "time", payload: newValue});
                    }}
                />
            </LocalizationProvider>
            {taskId &&
                <span className={s.info}>{state.edit ? "Updated at:" : "Created at:"} {state.createOrUpdate}</span>}
            <div className={s.btnWrapper}>
                {taskId && (
                    <button type="button" onClick={handleDelete} className={s.deleteBtn}>
                        <TrashIcon className={s.trashIcon}/>
                    </button>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={state.title && state.date ? false : true}
                    onClick={() => {
                        dispatch({type: "createOrUpdate"})
                        if (taskId) {
                            dispatch({type: "edit"});
                        }
                        dispatch({type: "id", payload: nanoid()});
                    }}
                >
                    SAVE
                </Button>
            </div>
        </form>
    );
}
