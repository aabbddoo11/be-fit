import "./AnnouncementBar.css";

const AnnouncementBar = () => {
  const message =
    "New User? Use code WELCOME10 to get 10% off";

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <div className="announcement-group">
          <span>{message}</span>
          <span className="announcement-separator">•</span>
          <span>{message}</span>
          <span className="announcement-separator">•</span>
          <span>{message}</span>
          <span className="announcement-separator">•</span>
          <span>{message}</span>
          <span className="announcement-separator">•</span>
        </div>

        <div className="announcement-group">
          <span>{message}</span>
          <span className="announcement-separator">•</span>
          <span>{message}</span>
          <span className="announcement-separator">•</span>
          <span>{message}</span>
          <span className="announcement-separator">•</span>
          <span>{message}</span>
          <span className="announcement-separator">•</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;