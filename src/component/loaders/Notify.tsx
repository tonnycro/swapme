import React, { useContext } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon 
} from 'lucide-react';
import { BContext } from '../../utils/Context';


const Notify: React.FC = () => {

    const { notify, setNotify } = useContext(BContext);
    const { active, type, title, message } = notify;

    const onClose = () => {
        setNotify({
            active: false,
            type: '',
            title: '',
            message: ''
          });
    }


  if (!active) return null;

  const notificationStyles = {
    success: {
      background: 'bg-green-50',
      border: 'border-green-300',
      icon: <CheckCircleIcon className="text-green-500 mr-3" />,
      textColor: 'text-green-800'
    },
    error: {
      background: 'bg-red-50',
      border: 'border-red-300',
      icon: <XCircleIcon className="text-red-500 mr-3" />,
      textColor: 'text-red-800'
    },
    warn: {
      background: 'bg-yellow-50',
      border: 'border-yellow-300',
      icon: <AlertTriangleIcon className="text-yellow-500 mr-3" />,
      textColor: 'text-yellow-800'
    }
  };

  const { background, border, icon, textColor } = notificationStyles[type as  "success" | "error" | "warn" ] || notificationStyles.success;

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 
        ${background} ${border} border 
        rounded-lg shadow-lg 
        p-4 flex items-center 
        max-w-sm w-full 
        transition-all duration-300 
        animate-slide-in
      `}
    >
      {icon}
      <div>
        <h3 className={`font-semibold ${textColor}`}>{title}</h3>
        <p className={`text-sm ${textColor} opacity-80`}>{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="ml-auto text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  );
};

export default Notify;