export default function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-gray-900"></div>
    </div>
  );
}
