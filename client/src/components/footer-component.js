import React from "react";

const FooterComponent = () => {
  return (
    <footer className="p-3 mt-4 text-body-secondary border-top bottom-0">
      <p className="text-center">
        &copy; 2023 Katherine Tsai&ensp;
        <a
          href="https://github.com/ytsai4"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black"
        >
          <i className="fa-brands fa-github"></i>
        </a>
      </p>
    </footer>
  );
};

export default FooterComponent;
