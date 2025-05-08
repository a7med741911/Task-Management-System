import React from "react";
import Cards from "../components/Cards";

import { useState, useEffect } from "react";
import InputData from "../components/InputData";

const IncompleteTasks = () => {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false); 
  const baseUrl = "http://localhost:1000/api/v2";

  const [refreshPage, setRefreshPage] = useState(false); 

  const reload = () => {
    setRefreshPage((prev) => !prev);
  }


  
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
      const incompleteTasks = data.data.tasks.filter(
        (task) => task.complete === false
      );
      setTasks(incompleteTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching tasks...");
    getTasks();
  }, []);

  console.log("incompleteTasks component rendered");
  return (
    <div>
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

export default IncompleteTasks;
