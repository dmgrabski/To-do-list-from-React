import React, { useState, useEffect } from 'react';

function ToDoList() {

    const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    // Zadania sa obiektami, początkowo miałem stringi
    return savedTasks ? JSON.parse(savedTasks) : [
        { text: "Eat Breakfast", isImportant: false },
        { text: "Take a shower", isImportant: false },
        { text: "Walk the dog", isImportant: false }
    ];
});
    const [newTask, setNewTask] = useState("");

    const [selectedTaskIndex, setSelectedTaskIndex] = useState(null); // śledzenie zaznaczonego zadania

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch(event.key) {
                case 'ArrowUp':
                    // Logika przesuwania zadania w górę
                    if(selectedTaskIndex > 0) {
                        moveTaskUp(selectedTaskIndex);
                        setSelectedTaskIndex(selectedTaskIndex - 1);
                    }
                    break;
                case 'ArrowDown':
                    // Logika przesuwania zadania w dół
                    if(selectedTaskIndex < tasks.length - 1) {
                        moveTaskDown(selectedTaskIndex);
                        setSelectedTaskIndex(selectedTaskIndex + 1);
                    }
                    break;
                case 'Delete':
                    // Logika usuwania zaznaczonego zadania
                    if(selectedTaskIndex !== null) {
                        deleteTask(selectedTaskIndex);
                        setSelectedTaskIndex(null); // Reset wyboru
                    }
                    break;
                default:
                    break;
            }
        };
    
        // Dodawanie nasłuchiwacza
        document.addEventListener('keydown', handleKeyDown);
    
        // Usuwanie nasłuchiwacza przy odmontowywaniu komponentu
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedTaskIndex, tasks]); // Dodaj tasks jako zależność, jeśli jej stan wpływa na logikę klawiszy

    function handleInputChange(event){
        setNewTask(event.target.value);

    }

    function addTask() {
        if (newTask.trim() !== "") {
            // Dodawanie nowego zadania jako obiektu
            setTasks(t => [...t, { text: newTask, isImportant: false }]);
            setNewTask("");
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    }

    function deleteTask(index){

        const updateTasks = tasks.filter((_, i) => i !== index);
        setTasks(updateTasks);



    }

    function moveTaskUp(index){
        if(index > 0){
            const updatedTasks = [...tasks];
            [updatedTasks[index],updatedTasks[index - 1] ] =
            [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }


    }

    function moveTaskDown(index){
        if(index < tasks.length - 1){
            const updatedTasks = [...tasks];
            [updatedTasks[index],updatedTasks[index + 1] ] =
            [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }


    }

    function toggleImportance(index) {
        setTasks(tasks.map((task, i) => i === index ? { ...task, isImportant: !task.isImportant } : task));
    }

return(
<div className='to-do-list'>

    <h1>To-Do-List</h1>

    <div>
        <input
         type='text'
         placeholder='Enter a task...'
         value={newTask}
         onChange={handleInputChange}
         onKeyPress={handleKeyPress}/>
         <button
         className='add-button'
         onClick={addTask}>
            Add
         </button>

    </div>

    <ol>
    {[...tasks]
        .sort((a, b) => b.isImportant - a.isImportant)
        .map((task, index) => (
            <li key={index}
                className={selectedTaskIndex === index ? 'selected' : ''}
                onClick={() => setSelectedTaskIndex(index)}>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Zapobieganie wyzwalaniu onClick li przy kliknięciu buttona
                        toggleImportance(index);
                    }}>
                    {task.isImportant ? '⭐' : '☆'}
                </button>
                <span className={`text ${task.isImportant ? 'important' : ''}`}>{task.text}</span>
                <button className='delete-button'
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(index);
                }}>
                    Delete
                </button>
                <button className='move-button'
                onClick={(e) => {
                    e.stopPropagation();
                    moveTaskUp(index);
                }}>
                    ☝
                </button>
                <button className='move-button'
                onClick={(e) => {
                    e.stopPropagation();
                    moveTaskDown(index);
                }}>
                    👇
                </button>
            </li>
        ))}
</ol>





</div>);

}
export default ToDoList