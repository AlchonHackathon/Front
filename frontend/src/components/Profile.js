import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// use npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import './styling/Profile.css';
import user from '../icons/person.png';
import file from '../icons/document.png';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const USER_URL = '/api/users';
  const FILE_URL = '/api/uploads';

  const [profile, setProfile] = useState({
    name: '',
    userId: '',
    email: '',
    type: '',
    newPassword: '',
    confirmPassword: '',
    oldPassword: '',
    profile_pic: null,
    picturePreview: user,
  });

  const [isTyped, setIsTyped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [passwordTyped, setPasswordTyped] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${USER_URL}/me`, {
          signal: controller.signal,
          headers: headers,
        });
        setProfile((prevState) => ({
          ...prevState,
          ...response.data.user,
        }));
        console.log(response.data);

        let newProfilePic = response.data.user.profile_pic;
        if (newProfilePic) {
          console.log('in if statement');
          const response = await axios.get(`${FILE_URL}/pictures/${newProfilePic}`, {
            signal: controller.signal,
            headers: headers,
          });
          setProfile((prevState) => ({
            ...prevState,
            profile_pic: response.data.picture,
            picturePreview: response.data.picture,
          }));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === 'newPassword' && value.length > 0) {
      setPasswordTyped(true);
    }
    setIsTyped(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowOldPassword) => !prevShowOldPassword);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile((prevState) => ({
      ...prevState,
      profile_pic: file,
      picturePreview: URL.createObjectURL(file),
    }));
    setIsTyped(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, userId, email, newPassword, confirmPassword, oldPassword } = profile;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const userIdRegex = /^\d+$/;

    if (name.trim() === '') {
      alert('Please Enter Your Name');
      return;
    }
    if (userId.trim() === '') {
      alert('Please Enter Your Student ID');
      return;
    }
    if (!userIdRegex.test(userId)) {
      alert('Student ID Must Be Number Only.');
      return;
    }
    if (email.trim() === '') {
      alert('Please Enter Your Email.');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('Please Enter a Valid Email Address (test@skku.com)');
      return;
    }
    if (passwordTyped && newPassword.trim() === '') {
      alert('Please Enter Your New Password.');
      return;
    }
    if (passwordTyped && !passwordRegex.test(newPassword)) {
      alert('Password Must Be At Least 8 Characters Long, Include Number, Letter, and Unique Symbol.');
      return;
    }
    if (passwordTyped && confirmPassword.trim() === '') {
      alert('Please Confirm Your Password.');
      return;
    }
    if (passwordTyped && newPassword !== confirmPassword) {
      alert('New passwords Do Not Match.');
      return;
    }
    if (passwordTyped && oldPassword.trim() === '') {
      alert('Please Enter Your Old Password.');
      return;
    }

    if (profile.profile_pic) {
      const picFormData = new FormData();
      picFormData.append('file', profile.profile_pic);

      await axios
        .post(`${FILE_URL}/single`, picFormData, {
          headers: headers,
        })
        .then((response) => {
          console.log('Picture uploaded:', response.data);
          setProfile((prevState) => ({ ...prevState, profile_pic: response.data.fileId }));
        })
        .catch((error) => {
          console.error('Error uploading picture:', error);
          alert('Failed to upload picture: ' + error.message);
        });
    }

    console.log(profile);

    axios
      .put(`${USER_URL}/me`, profile, {
        headers: headers,
      })
      .then((response) => {
        console.log('Profile updated:', response.data);
        alert('Profile updated successfully!');
        setIsTyped(false);
        setPasswordTyped(false);
        setProfile((prevState) => ({
          ...prevState,
          newPassword: '',
          confirmPassword: '',
          oldPassword: '',
        }));
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile: ' + error.message);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Token removed, navigating to login');
    navigate('/login');
  };
  

  return (
    <div className="profile-wrapper">
      <div className="ProfileInside-wrapper">
        <div className="ProfileInsideMain-wrapper">
          <div className="ProfileInsideMainLeft-wrapper">
            <div className="ProfileName-wrapper">
              <p className="ProfileName-text">Name</p>
              <input
                className="ProfileName-bar"
                type="text"
                name="name"
                placeholder="Your Name"
                value={profile.name}
                onChange={handleChange}
              ></input>
            </div>

            <div className="ProfileEmail-wrapper">
              <p className="ProfileEmail-text">Email</p>
              <input
                className="ProfileEmail-bar"
                type="text"
                name="email"
                placeholder="Your Email"
                value={profile.email}
                onChange={handleChange}
              ></input>
            </div>

            <div className="ProfileUserId-wrapper">
              <p className="ProfileUserId-text">
                {profile.type === 'professor' ? 'Professor ID' : 'Student ID'}
              </p>
              <input
                className="ProfileUserId-bar"
                type="text"
                name="userId"
                placeholder={profile.type === 'professor' ? 'Your Professor ID' : 'Your Student ID'}
                value={profile.userId}
                onChange={handleChange}
                disabled={true}
              ></input>
            </div>

            <div className="ProfilePassword-wrapper">
              <p className="ProfilePassword-text">New Password</p>
              <div className="ProfilePasswordInputBar-wrapper">
                <input
                  className="ProfilePassword-bar"
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="New Password"
                  value={profile.newPassword}
                  onChange={handleChange}
                ></input>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="ProfilePassword-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>

            <div className="ProfileConfirmPassword-wrapper">
              <p className={`ProfileConfirmPassword-text ${!passwordTyped ? 'disabled' : ''}`}>
                Confirm Password
              </p>
              <div className="ProfileConfirmPasswordInputBar-wrapper">
                <input
                  className={`ProfileConfirmPassword-bar ${!passwordTyped ? 'disabled' : ''}`}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Your Password"
                  value={profile.confirmPassword}
                  onChange={(e) => {
                    setProfile((prevState) => ({
                      ...prevState,
                      confirmPassword: e.target.value,
                    }));
                    setIsTyped(true);
                  }}
                  disabled={!passwordTyped}
                ></input>
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                  className="ProfilePassword-icon"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{ pointerEvents: passwordTyped ? 'auto' : 'none', color: passwordTyped ? 'black' : 'rgb(188, 188, 188)' }}
                />
              </div>
            </div>

            <div className="ProfileConfirmPassword-wrapper">
              <p className={`ProfileConfirmPassword-text ${!passwordTyped ? 'disabled' : ''}`}>
                Old Password
              </p>
              <div className="ProfileConfirmPasswordInputBar-wrapper">
                <input
                  className={`ProfileConfirmPassword-bar ${!passwordTyped ? 'disabled' : ''}`}
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  placeholder="Old Password"
                  value={profile.oldPassword}
                  onChange={(e) => {
                    setProfile((prevState) => ({
                      ...prevState,
                      oldPassword: e.target.value,
                    }));
                    setIsTyped(true);
                  }}
                  disabled={!passwordTyped}
                ></input>
                <FontAwesomeIcon
                  icon={showOldPassword ? faEyeSlash : faEye}
                  className="ProfilePassword-icon"
                  onClick={toggleOldPasswordVisibility}
                  style={{ pointerEvents: passwordTyped ? 'auto' : 'none', color: passwordTyped ? 'black' : 'rgb(188, 188, 188)' }}
                />
              </div>
            </div>
            
            <div className="ProfileButton-wrapper">
              <button
                className={`Profile-button ${!isTyped ? 'disabled' : ''}`}
                type="submit"
                onClick={handleSubmit}
                disabled={!isTyped}
              >
                Save Changes
              </button>
            </div>

            <div className="ProfileButton-wrapper">
              <button
                className="Profile-button logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>  
          </div>

          <div className="ProfileInsideMainRight-wrapper">
            <div className="ProfileInsideHeader-wrapper">
              <p className="Profile-header">Hey {profile.name.split(' ')[0]}!</p>
            </div>
            <div className="ProfileAccount-wrapper">
              <img className="ProfileAccount-logo" src={profile.picturePreview} />
            </div>

            <div className="ProfileChangePicture-wrapper">
              <input
                type="file"
                id="files"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              ></input>
              <label htmlFor="files" className="ProfileChangePicture-text">
                change your profile picture here
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
