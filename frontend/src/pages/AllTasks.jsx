import React, { useState, useEffect } from "react";
import Cards from "../components/Cards";
import InputData from "../components/InputData";
import { IoAddCircleSharp } from "react-icons/io5";

const AllTasks = () => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [refreshPage, setRefreshPage] = useState(false); 

  const reload = () => {
    setRefreshPage((prev) => !prev);
  };

  const baseUrl = "http://localhost:1000/api/v2";

  
  const getTasks = async () => {
    setLoading(true); 

    const header = {
      id: localStorage.getItem("id"),
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      const res = await fetch(`${baseUrl}/get-all-tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...header,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      console.log("Fetched tasks:", data);

      setTasks(data.data.tasks);
    } catch (error) {
      setTasks([]); 
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    getTasks();
  }, [refreshPage]); 

 
  const handleTaskAdded = async () => {
    setIsInputOpen(false); 
    setRefreshPage((prev) => !prev); 
  };

 
  const handleTaskUpdated = async () => {
    setRefreshPage((prev) => !prev); 
  };

  
  const handleTaskDeleted = async () => {
    setRefreshPage((prev) => !prev); 
  };

  return (
    <div>
      <div className="w-full flex items-end px-4 py-2">
        <button
          onClick={() => setIsInputOpen(true)}
          className="text-4xl text-gray-400 hover:text-gray-100 transition-all duration-300"
        >
          <IoAddCircleSharp />
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-500 py-4">Loading tasks...</div>
      )}
      {!loading && tasks.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          No tasks available. Please add a new task.
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-3 gap-4 p-4">
          {tasks.map((task) => (
            <Cards
              key={task._id}
              id={task._id}
              title={task.title}
              desc={task.desc}
              status={task.complete ? "Complete" : "Incomplete"}
              important={task.important}
              onTaskUpdated={handleTaskUpdated} 
              onTaskDeleted={handleTaskDeleted} 
              reload={reload}
            />
          ))}
        </div>
      )}

      {isInputOpen && (
        <InputData
          setIsModalOpen={setIsInputOpen}
          onTaskAdded={handleTaskAdded}
          reload={reload}
        />
      )}
    </div>
  );
};

export default AllTasks;
