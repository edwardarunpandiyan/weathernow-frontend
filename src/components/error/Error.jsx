import { useAppDispatch } from "../../hooks/useAppHooks";
import { initializeApp } from "../../features/weather/weatherSlice";
import "../../styles/error/Error.css";

const Error = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="error-page">
            <div className="error-card">
                <div className="error-icon">⚠️</div>

                <h2 className="error-title">
                    Oops! Something went wrong
                </h2>

                <button
                    className="error-retry-btn"
                    onClick={() => dispatch(initializeApp())}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

export default Error;
