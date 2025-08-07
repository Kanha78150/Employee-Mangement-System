import { useAuth } from "../context/AuthContext";
import styled from "styled-components";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-gray-800 text-white w-full h-[80px] flex items-center justify-between p-5 sm:w-full md:w-full lg:w-full">
      <div className="text-2xl font-bold text-white sm:text-4xl md:text-4xl lg:text-4xl">
        {user.role === "admin" ? (
          <h3 className="text-center">Admin Portal</h3>
        ) : (
          <h3>Employee Portal</h3>
        )}
      </div>

      <StyledRightSection>
        {user && (
          <nav className="flex items-center justify-between w-full sm:flex-row">
            <button className="Btn" onClick={logout}>
              <div className="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
              </div>
              <div className="text">Logout</div>
            </button>
          </nav>
        )}
      </StyledRightSection>
    </div>
  );
}

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: rgb(255, 65, 65);
    margin-top: 0.5rem;
  }

  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: white;
  }

  .text {
    position: absolute;
    right: 0;
    height: 100%;
    width: 0%;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1em;
    font-weight: 600;
    transition-duration: 0.3s;
  }

  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 10px;
  }

  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 50px;
  }

  .Btn:active {
    transform: translate(2px, 2px);
  }

  /* 🔽 Responsive styles */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    .Btn {
      margin-top: 0.5rem;
    }
    .text {
      font-size: 1em;
    }
  }

  @media (max-width: 480px) {
    span {
      font-size: 0.9em;
      text-align: center;
    }

    .text {
      font-size: 0.9em;
    }
  }
`;
