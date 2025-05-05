import React from 'react';

interface LogoProps {
  name?: string;
  size?: string;
  bgColor?: string;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({
  name = 'Chat Application',
  size = 'w-auto',
  bgColor = 'bg-white',
  textColor = 'text-black',
  
}) => {
  return (
    <div
      className={` font-poppins text-2xl font-bold text-center flex items-center justify-center mx-auto mb-4 ${bgColor} ${textColor} ${size} `}
    >
      {name}
    </div>
  );
};

export default Logo;
