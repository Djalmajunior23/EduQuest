export const EmptyState = ({ title, message }: { title: string, message: string }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-2xl border-slate-200">
      <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      <p className="text-slate-500">{message}</p>
    </div>
  );
