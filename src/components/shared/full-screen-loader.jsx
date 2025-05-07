
import { ImSpinner9 } from "react-icons/im";

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <ImSpinner9 className="animate-spin text-4xl text-indigo-600" />
      </div>
    </div>
  );
};

export default FullScreenLoader;
