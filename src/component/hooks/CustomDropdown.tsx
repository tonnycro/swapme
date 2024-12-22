import React, { useState } from "react";
import UseClickOutside from "./useClickOutside"


interface Option {
  label?: string;
  value?: string | number;
  img?: string;
}

interface CustomProps {
  options: Option[] | string[] | number[];
  setSelectedValueForm?: React.Dispatch<React.SetStateAction<any>>;
  setSelectedValueSimple?: React.Dispatch<React.SetStateAction<any>>;
}

const CustomDropdown = ({
  options,
  setSelectedValueForm,
  setSelectedValueSimple,
}: CustomProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<
    Option | string | number
  >(typeof options[0] === "object" ? options[0] : "");

  const handleClickOutside = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const ref = UseClickOutside<HTMLDivElement>(handleClickOutside);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: Option | string | number) => {
    setSelectedOption(option);

    if (setSelectedValueForm) {
      const target = {
        name: "state",
        value: option,
      };
      setSelectedValueForm({ target });
    }

    if (setSelectedValueSimple) {
      setSelectedValueSimple(option);
    }

    setIsOpen(false);
  };

  const isOptionObject = (option: any): option is Option =>
    typeof option === "object";

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={toggleDropdown}
        className="w-full border text-gray-600 border-orange-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-start cursor-pointer flex justify-between items-center"
      >
        {isOptionObject(selectedOption) && selectedOption.img ? (
          <div className="flex items-center">
            <img
              src={selectedOption.img}
              alt={`${selectedOption.label || "option"} logo`}
              width={20}
              height={20}
              className="w-5 h-5 mr-2 rounded-full object-contain"
            />
            <span className="text-white">{selectedOption.label}</span>
          </div>
        ) : (
          <span>{String(selectedOption)}</span>
        )}

        {/* Icon */}
        <div>
          {!isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path fill="#1B7339" d="m7 10l5 5l5-5z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="#1B7339"
                d="M8.2 14q-.225 0-.362-.15T7.7 13.5q0-.05.15-.35l3.625-3.625q.125-.125.25-.175T12 9.3t.275.05t.25.175l3.625 3.625q.075.075.113.163t.037.187q0 .2-.137.35T15.8 14z"
              ></path>
            </svg>
          )}
        </div>
      </div>

      {isOpen && (
        <ul
          className={`absolute z-10 w-full ${
            options.length > 10 ? "h-40" : "h-auto"
          } mt-1 bg-[#1D202F] rounded shadow-lg overflow-x-hidden overflow-y-auto`}
        >
          {options.map((option, index) =>
            isOptionObject(option) && option.img ? (
              <div
                key={option.value || index}
                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-[#3f3a54] ${
                  selectedOption === option
                    ? "bg-[#3f3a54] border-l-4 border-indigo-500"
                    : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <img
                  src={option.img}
                  alt={`${option.label} logo`}
                  width={20}
                  height={20}
                  className="w-5 h-5 mr-2 rounded-full object-contain"
                />
                <span className="text-white">{option.label}</span>
              </div>
            ) : (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-green-700 hover:bg-opacity-[14%] cursor-pointer text-green-700"
              >
                {String(option)}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
