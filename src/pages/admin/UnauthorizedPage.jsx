import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

const UnauthorizedAccess = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="bg-grid-gray-300/[0.2] min-h-screen w-full to-violet-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100 relative">
        <h1 className="text-lg font-bold text-primary mb-3">
          Unauthorized Access
        </h1>
        <p className="text-xs text-gray-500 mb-8">
          You don't have permission to access this page.
        </p>

        <div className="flex justify-center mb-6">
          <Loader />
        </div>

        <div className="mb-1">
          <CustomButton
            text="Go Back"
            color="primary"
            hover_color="hoverAccent"
            variant="filled"
            width="w-full"
            height="h-9"
            type="submit"
            onClick={goBack}
          />
        </div>
      </div>

      <div className="text-xs text-primary/40 mt-8">
        If you need immediate assistance, please contact
        <a
          href="mailto:needle360.online@gmail.com"
          className="text-primary hover:text-primary/80 ml-1"
        >
          needle360.online@gmail.com
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
