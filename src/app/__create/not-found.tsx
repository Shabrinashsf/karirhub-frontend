import { useNavigate, useLocation } from 'react-router';
import { useCallback } from 'react';

export default function CreateDefaultNotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const missingPath = location.pathname.replace(/^\//, '');

  const handleBack = () => {
    navigate('/');
  };

  const handleCreatePage = useCallback(() => {
    window.parent.postMessage(
      {
        type: 'sandbox:web:create',
        path: missingPath,
        view: 'web',
      },
      '*'
    );
  }, [missingPath]);

  return (
    <div className="flex sm:w-full w-screen sm:min-w-[850px] flex-col">
      <div className="flex w-full items-center gap-2 p-5">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-md"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Back"
            role="img"
          >
            <path
              d="M8.5957 2.65435L2.25005 9L8.5957 15.3457"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.25007 9L15.75 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex flex-row divide-x divide-gray-200 rounded-[8px] h-8 w-[300px] border border-gray-200 bg-gray-50 text-gray-500">
          <div className="flex items-center px-[14px] py-[5px]">
            <span>/</span>
          </div>
          <div className="flex items-center min-w-0">
            <p
              className="border-0 bg-transparent px-3 py-2 focus:outline-none truncate max-w-[300px]"
              style={{ minWidth: 0 }}
              title={missingPath}
            >
              {missingPath}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-grow flex-col items-center justify-center pt-[100px] text-center gap-[20px]">
        <h1 className="text-4xl font-medium text-gray-900 px-2">
          Uh-oh! This page doesn't exist (yet).
        </h1>

        <p className="pt-4 pb-12 px-2 text-gray-500">
          Looks like "<span className="font-bold">/{missingPath}</span>" isn't part of your project.
          But no worries, you've got options!
        </p>

        <div className="px-[20px] w-full">
          <div className="flex flex-row justify-center items-center w-full max-w-[800px] mx-auto border border-gray-200 rounded-lg p-[20px] mb-[40px] gap-[20px]">
            <div className="flex flex-col gap-[5px] items-start self-start w-1/2">
              <p className="text-sm text-black text-left">Build it from scratch</p>
              <p className="text-sm text-gray-500 text-left">
                Create a new page to live at "<span>/{missingPath}</span>"
              </p>
            </div>
            <div className="flex flex-row items-center justify-end w-1/2">
              <button
                type="button"
                className="bg-black text-white px-[10px] py-[5px] rounded-md"
                onClick={() => handleCreatePage()}
              >
                Create Page
              </button>
            </div>
          </div>
        </div>

        <div className="pb-20 lg:pb-[80px]">
          <p className="flex items-center text-gray-500">
            Check out all your project's routes here ↓
          </p>
        </div>

        <div className="pb-10">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
}
