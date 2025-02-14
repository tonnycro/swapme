function Preloader() {
    return (
      <div className="bg-black fixed flex justify-center items-center w-full h-[100dvh] z-50 overflow-hidden">
        <video
          src="/pegasusloader.mp4" // Use `/` if the file is in the public folder
          autoPlay
          loop
          muted
          playsInline
          className="w-50 h-50 object-cover" // Adjust styles as needed
        ></video>
      </div>
    );
  }
  
  export default Preloader;