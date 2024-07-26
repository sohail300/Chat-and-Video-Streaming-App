const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className={`
          border-4 border-t-transparent rounded-full animate-spin
        `}
      ></div>
    </div>
  );
};

export default Loader;
