import {Calendar, Header} from "./components/index";
import {useEffect, useState} from "react";
import dayjs from "dayjs";

console.log(dayjs("2022-09-30T21:00:00.000Z"))

function App() {
    const [monthAndYear, setMonthAndYear] = useState(() => localStorage.getItem('monthAndYear') ? dayjs(JSON.parse(localStorage.getItem('monthAndYear'))) : dayjs())
    const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks'))? JSON.parse(localStorage.getItem('tasks')) : []);
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('monthAndYear', JSON.stringify(monthAndYear));
    }, [tasks,monthAndYear])

    const handleButtonClick = (e) => {
        const name = e.currentTarget.name;
        const monthDecrement = dayjs(monthAndYear.month(monthAndYear.month() - 1));
        const monthIncrement = dayjs(monthAndYear.month(monthAndYear.month() + 1));

        switch (name) {
            case "decrement":
                setMonthAndYear(monthDecrement);
                break;

            case "increment":
                setMonthAndYear(monthIncrement);
                break;

            default:
                return;
        }
    }

    return (
        <div>
            <Header
                monthAndYear={monthAndYear}
                handleButtonClick={handleButtonClick}
                setMonthAndYear={setMonthAndYear}
                setTasks={setTasks}

            />
            <Calendar monthAndYear={monthAndYear} tasks={tasks} setTasks={setTasks}/>
        </div>
    );
}

export default App;