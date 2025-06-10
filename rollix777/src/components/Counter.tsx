import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Counter: {count}</h1>
    </div>
  );
};

export default Counter;
