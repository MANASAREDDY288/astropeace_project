export const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-grow shadow-md  mb-2 p-2 mx-auto min-w-[360px] overflow-y-auto h-[calc(100vh-169px)] bg-white dark:bg-black rounded-none">
      {children}
    </main>
  );
};
