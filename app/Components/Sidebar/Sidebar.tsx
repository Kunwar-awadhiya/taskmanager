/*
"use client";
import React from "react";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import Image from "next/image";

import menu from "@/app/utils/menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "../Button/Button";
import { arrowLeft, bars, logout } from "@/app/utils/Icons";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";

function Sidebar() {
  const { theme, collapsed, collapseMenu } = useGlobalState();
  const { signOut } = useClerk();

  const { user } = useUser();

  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "",
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <SidebarStyled theme={theme} collapsed={collapsed}>
      <button className="toggle-nav" onClick={collapseMenu}>
        {collapsed ? bars : arrowLeft}
      </button>
      <div className="profile">
        <div className="profile-overlay"></div>
        <div className="image">
          <Image width={70} height={70} src={imageUrl} alt="profile" />
        </div>
        <div className="user-btn absolute z-20 top-0 w-full h-full">
          <UserButton />
        </div>
        <h1 className="capitalize">
          {firstName} {lastName}
        </h1>
      </div>
      <ul className="nav-items">
        {menu.map((item) => {
          const link = item.link;
          return (
            <li
              key={item.id}
              className={`nav-item ${pathname === link ? "active" : ""}`}
              onClick={() => {
                handleClick(link);
              }}
            >
              {item.icon}
              <Link href={link}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
      <div className="sign-out relative m-6">
        <Button
          name={"Sign Out"}
          type={"submit"}
          padding={"0.4rem 0.8rem"}
          borderRad={"0.8rem"}
          fw={"500"}
          fs={"1.2rem"}
          icon={logout}
          click={() => {
            signOut(() => router.push("/signin"));
          }}
        />
      </div>
    </SidebarStyled>
  );
}

const SidebarStyled = styled.nav<{ collapsed: boolean }>`
  position: relative;
  width: ${(props) => props.theme.sidebarWidth};
  background-color: ${(props) => props.theme.colorBg2};
  border: 2px solid ${(props) => props.theme.borderColor2};
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: ${(props) => props.theme.colorGrey3};

  @media screen and (max-width: 768px) {
    position: fixed;
    height: calc(100vh - 2rem);
    z-index: 100;

    transition: all 0.3s cubic-bezier(0.53, 0.21, 0, 1);
    transform: ${(props) =>
      props.collapsed ? "translateX(-107%)" : "translateX(0)"};

    .toggle-nav {
      display: block !important;
    }
  }

  .toggle-nav {
    display: none;
    padding: 0.8rem 0.9rem;
    position: absolute;
    right: -69px;
    top: 1.8rem;

    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;

    background-color: ${(props) => props.theme.colorBg2};
    border-right: 2px solid ${(props) => props.theme.borderColor2};
    border-top: 2px solid ${(props) => props.theme.borderColor2};
    border-bottom: 2px solid ${(props) => props.theme.borderColor2};
  }

  .user-btn {
    .cl-rootBox {
      width: 100%;
      height: 100%;

      .cl-userButtonBox {
        width: 100%;
        height: 100%;

        .cl-userButtonTrigger {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
  }

  .profile {
    margin: 1.5rem;
    padding: 1rem 0.8rem;
    position: relative;

    border-radius: 1rem;
    cursor: pointer;

    font-weight: 500;
    color: ${(props) => props.theme.colorGrey0};

    display: flex;
    align-items: center;

    .profile-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
      z-index: 0;
      background: ${(props) => props.theme.colorBg3};
      transition: all 0.55s linear;
      border-radius: 1rem;
      border: 2px solid ${(props) => props.theme.borderColor2};

      opacity: 0.2;
    }

    h1 {
      font-size: 1.2rem;
      display: flex;
      flex-direction: column;

      line-height: 1.4rem;
    }

    .image,
    h1 {
      position: relative;
      z-index: 1;
    }

    .image {
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      transition: all 0.5s ease;
      border-radius: 100%;

      width: 70px;
      height: 70px;

      img {
        border-radius: 100%;
        transition: all 0.5s ease;
      }
    }

    > h1 {
      margin-left: 0.8rem;
      font-size: clamp(1.2rem, 4vw, 1.4rem);
      line-height: 100%;
    }

    &:hover {
      .profile-overlay {
        opacity: 1;
        border: 2px solid ${(props) => props.theme.borderColor2};
      }

      img {
        transform: scale(1.1);
      }
    }
  }

  .nav-item {
    position: relative;
    padding: 0.8rem 1rem 0.9rem 2.1rem;
    margin: 0.3rem 0;

    display: grid;
    grid-template-columns: 40px 1fr;
    cursor: pointer;
    align-items: center;

    &::after {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 0;
      height: 100%;
      background-color: ${(props) => props.theme.activeNavLinkHover};
      z-index: 1;
      transition: all 0.3s ease-in-out;
    }

    &::before {
      position: absolute;
      content: "";
      right: 0;
      top: 0;
      width: 0%;
      height: 100%;
      background-color: ${(props) => props.theme.colorGreenDark};

      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
    }

    a {
      font-weight: 500;
      transition: all 0.3s ease-in-out;
      z-index: 2;
      line-height: 0;
    }

    i {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colorIcons};
    }

    &:hover {
      &::after {
        width: 100%;
      }
    }
  }

  .active {
    background-color: ${(props) => props.theme.activeNavLink};

    i,
    a {
      color: ${(props) => props.theme.colorIcons2};
    }
  }

  .active::before {
    width: 0.3rem;
  }

  > button {
    margin: 1.5rem;
  }
`;

export default Sidebar;
*/

"use client";
import React from "react";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import Image from "next/image";

import menu from "@/app/utils/menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "../Button/Button";
import { arrowLeft, bars, logout } from "@/app/utils/Icons";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";

function Sidebar() {
  const { theme, collapsed, collapseMenu } = useGlobalState();
  const { signOut } = useClerk();

  const { user } = useUser();

  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "",
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (link: string) => {
    router.push(link);
    // Auto-close sidebar on mobile after navigation
    if (window.innerWidth <= 768 && !collapsed) {
      collapseMenu();
    }
  };

  const handleToggle = () => {
    collapseMenu();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <MobileOverlay 
        collapsed={collapsed} 
        onClick={collapseMenu}
        className="mobile-overlay"
      />
      
      <SidebarStyled theme={theme} collapsed={collapsed}>
        {/* Enhanced Hamburger Button */}
        <HamburgerButton className="toggle-nav" onClick={handleToggle}>
          <span className="hamburger-icon">
            {collapsed ? bars : arrowLeft}
          </span>
        </HamburgerButton>

        <div className="profile">
          <div className="profile-overlay"></div>
          <div className="image">
            <Image width={70} height={70} src={imageUrl} alt="profile" />
          </div>
          <div className="user-btn absolute z-20 top-0 w-full h-full">
            <UserButton />
          </div>
          <h1 className="capitalize">
            <span className="first-name">{firstName}</span>
            <span className="last-name">{lastName}</span>
          </h1>
        </div>

        <ul className="nav-items">
          {menu.map((item) => {
            const link = item.link;
            return (
              <li
                key={item.id}
                className={`nav-item ${pathname === link ? "active" : ""}`}
                onClick={() => {
                  handleClick(link);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <Link href={link} className="nav-link">{item.title}</Link>
              </li>
            );
          })}
        </ul>

        <div className="sign-out relative m-6">
          <Button
            name={"Sign Out"}
            type={"submit"}
            padding={"0.4rem 0.8rem"}
            borderRad={"0.8rem"}
            fw={"500"}
            fs={"1.2rem"}
            icon={logout}
            click={() => {
              signOut(() => router.push("/signin"));
            }}
          />
        </div>
      </SidebarStyled>
    </>
  );
}

const MobileOverlay = styled.div<{ collapsed: boolean }>`
  display: none;
  
  @media screen and (max-width: 768px) {
    display: ${(props) => (props.collapsed ? "none" : "block")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 99;
    transition: opacity 0.3s ease;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  padding: 0.8rem 0.9rem;
  position: absolute;
  right: -69px;
  top: 1.8rem;
  
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  
  background-color: ${(props) => props.theme.colorBg2};
  border-right: 2px solid ${(props) => props.theme.borderColor2};
  border-top: 2px solid ${(props) => props.theme.borderColor2};
  border-bottom: 2px solid ${(props) => props.theme.borderColor2};
  border-left: none;
  
  cursor: pointer;
  z-index: 101;
  
  transition: all 0.3s ease;
  
  .hamburger-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colorGrey3};
  }
  
  &:hover {
    background-color: ${(props) => props.theme.colorBg3};
    transform: translateX(-2px);
  }
  
  &:active {
    transform: translateX(-1px);
  }

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const SidebarStyled = styled.nav<{ collapsed: boolean }>`
  position: relative;
  width: ${(props) => props.theme.sidebarWidth};
  background-color: ${(props) => props.theme.colorBg2};
  border: 2px solid ${(props) => props.theme.borderColor2};
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: ${(props) => props.theme.colorGrey3};

  /* Mobile Responsiveness */
  @media screen and (max-width: 768px) {
    position: fixed;
    top: 1rem;
    left: 1rem;
    height: calc(100vh - 2rem);
    width: min(280px, 75vw);
    z-index: 100;

    transition: all 0.3s cubic-bezier(0.53, 0.21, 0, 1);
    transform: ${(props) =>
      props.collapsed ? "translateX(-107%)" : "translateX(0)"};
  }

  /* Tablet Responsiveness */
  @media screen and (max-width: 1024px) and (min-width: 769px) {
    width: ${(props) => (props.collapsed ? "80px" : "240px")};
    transition: width 0.3s ease;
  }

  /* Small Mobile Devices */
  @media screen and (max-width: 480px) {
    width: min(260px, 80vw);
    left: 0.5rem;
    top: 0.5rem;
    height: calc(100vh - 1rem);
  }

  .user-btn {
    .cl-rootBox {
      width: 100%;
      height: 100%;

      .cl-userButtonBox {
        width: 100%;
        height: 100%;

        .cl-userButtonTrigger {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
  }

  .profile {
    margin: 1.5rem;
    padding: 1rem 0.8rem;
    position: relative;

    border-radius: 1rem;
    cursor: pointer;

    font-weight: 500;
    color: ${(props) => props.theme.colorGrey0};

    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .profile-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(10px);
      z-index: 0;
      background: ${(props) => props.theme.colorBg3};
      transition: all 0.55s linear;
      border-radius: 1rem;
      border: 2px solid ${(props) => props.theme.borderColor2};

      opacity: 0.2;
    }

    h1 {
      font-size: clamp(1rem, 4vw, 1.2rem);
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      
      .first-name, .last-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .image,
    h1 {
      position: relative;
      z-index: 1;
    }

    .image {
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      transition: all 0.5s ease;
      border-radius: 100%;

      width: clamp(50px, 12vw, 70px);
      height: clamp(50px, 12vw, 70px);

      img {
        border-radius: 100%;
        transition: all 0.5s ease;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    > h1 {
      margin-left: 0.8rem;
      font-size: clamp(1rem, 4vw, 1.2rem);
      line-height: 100%;
      flex: 1;
      min-width: 0; /* Allow text truncation */
    }

    &:hover {
      .profile-overlay {
        opacity: 1;
        border: 2px solid ${(props) => props.theme.borderColor2};
      }

      img {
        transform: scale(1.1);
      }
    }

    /* Mobile Profile Adjustments */
    @media screen and (max-width: 480px) {
      margin: 1rem;
      padding: 0.8rem;
      
      .image {
        width: 50px;
        height: 50px;
      }
      
      h1 {
        font-size: 1rem;
        margin-left: 0.6rem;
      }
    }
  }

  .nav-items {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    
    /* Custom Scrollbar */
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${(props) => props.theme.colorGrey5};
      border-radius: 2px;
    }
  }

  .nav-item {
    position: relative;
    padding: 0.8rem 1rem 0.9rem 2.1rem;
    margin: 0.3rem 0;

    display: grid;
    grid-template-columns: 40px 1fr;
    cursor: pointer;
    align-items: center;
    gap: 0.5rem;

    &::after {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      width: 0;
      height: 100%;
      background-color: ${(props) => props.theme.activeNavLinkHover};
      z-index: 1;
      transition: all 0.3s ease-in-out;
    }

    &::before {
      position: absolute;
      content: "";
      right: 0;
      top: 0;
      width: 0%;
      height: 100%;
      background-color: ${(props) => props.theme.colorGreenDark};

      border-bottom-left-radius: 5px;
      border-top-left-radius: 5px;
    }

    .nav-link {
      font-weight: 500;
      transition: all 0.3s ease-in-out;
      z-index: 2;
      line-height: 1;
      text-decoration: none;
      color: inherit;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${(props) => props.theme.colorIcons};
      z-index: 2;
      flex-shrink: 0;
    }

    &:hover {
      &::after {
        width: 100%;
      }
    }

    /* Mobile Navigation Item Adjustments */
    @media screen and (max-width: 480px) {
      padding: 0.7rem 0.8rem 0.7rem 1.8rem;
      grid-template-columns: 35px 1fr;
      
      .nav-link {
        font-size: 0.95rem;
      }
    }
  }

  .active {
    background-color: ${(props) => props.theme.activeNavLink};

    .nav-icon,
    .nav-link {
      color: ${(props) => props.theme.colorIcons2};
    }
  }

  .active::before {
    width: 0.3rem;
  }

  .sign-out {
    margin: 1.5rem;
    
    @media screen and (max-width: 480px) {
      margin: 1rem;
    }
    
    button {
      width: 100%;
      font-size: clamp(1rem, 3vw, 1.2rem) !important;
      padding: clamp(0.3rem, 2vw, 0.4rem) clamp(0.6rem, 3vw, 0.8rem) !important;
    }
  }

  /* High DPI Displays */
  @media screen and (-webkit-min-device-pixel-ratio: 2) {
    border-width: 1px;
    
    .profile-overlay {
      border-width: 1px;
    }
  }

  /* Landscape Mobile */
  @media screen and (max-height: 500px) and (orientation: landscape) {
    .profile {
      margin: 1rem;
      padding: 0.6rem;
      
      .image {
        width: 45px;
        height: 45px;
      }
      
      h1 {
        font-size: 0.9rem;
      }
    }
    
    .nav-item {
      padding: 0.6rem 0.8rem 0.6rem 1.6rem;
      margin: 0.2rem 0;
    }
    
    .sign-out {
      margin: 1rem;
    }
  }
`;

export default Sidebar;
