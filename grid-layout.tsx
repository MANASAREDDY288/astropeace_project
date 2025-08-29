export const GridLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="flex-grow shadow-md  mb-2 p-2 mx-auto w-full overflow-y-auto h-[calc(100vh-169px)]  bg-white dark:bg-black rounded-none">
      {children}
    </aside>
  );
};
