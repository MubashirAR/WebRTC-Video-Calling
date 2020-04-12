import React, { useEffect, useState } from 'react';
import './style.css';

export default () => {
  const [isInit, setIsInit] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);
  // Get video stream
  const openMediaDevices = async constraints => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error(error);
      alert(`Couldn't get Camera. Please ensure camera permissions are granted for the browser and for the website.`);
    }
  };
  // get list of cameras/devices
  async function getConnectedDevices(type) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === type);
    } catch (error) {
      console.error(error);
      alert(`Couldn't get Camera List. Please ensure camera permissions are granted for the browser and for the website.`);
    }
  }
  // update the selection list with all cameras available
  function updateCameraList(cameras) {
    try {
      const listElement = document.querySelector('select#availableCameras');
      listElement.innerHTML = '';
      cameras
        .map(camera => {
          const cameraOption = document.createElement('option');
          cameraOption.label = camera.label;
          cameraOption.value = camera.deviceId;
          return cameraOption;
        })
        .forEach(cameraOption => {
          listElement.add(cameraOption);
        });
    } catch (error) {
      console.error(error);
      alert(`Unexpected error occured!`);
    }
  }
  // Open camera stream with constraints
  async function openCamera(cameraId, minWidth, minHeight) {
    try {
      const constraints = {
        audio: { echoCancellation: true },
        video: {
          deviceId: cameraId,
          width: { min: minWidth },
          height: { min: minHeight },
        },
      };
      return await openMediaDevices(constraints);
    } catch (error) {
      console.error(error);
      alert(`Couldn't get Camera List. Please ensure camera permissions are granted for the browser and for the website.`);
    }
  }
  // Display the local stream in UI
  const playVideoFromCamera = async () => {
    try {
      setIsOnCall(true);
      const cameraId = document.querySelector('select#availableCameras').value;
      const stream = await openCamera(cameraId, 480, 240);
      const videoElement = document.querySelector('video#self-video');
      videoElement.srcObject = stream;
      makeCall(stream);
    } catch (error) {
      console.error(error);
      alert(`Unexpected error occured!`);
    }
  };

  /* Signalling */

  async function makeCall(stream) {
    try {
      window.caller = true;
      // Create callerPC and attach stream
      const configuration = {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      };
      const peerConnection = new RTCPeerConnection(configuration);
      document.querySelector('#disconnect').addEventListener('click', () => {
        peerConnection.close();
      });
      peerConnection.addStream(stream);
      if (peerConnection.getSenders) {
        // TODO
        // For DTMF
        let dtmfSender = peerConnection.getSenders()[0].dtmf;
        console.log({ dtmfSender });
      }
      let selfCandidate = '';
      peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
          selfCandidate = event.candidate.candidate;
          const connectWith = document.querySelector('#other-username');
          window.socket.emit('new-ice-candidate', { candidate: event.candidate, to: connectWith.value });
        }
      });
      const remoteStream = new MediaStream();
      const videoElement = document.querySelector('video#other-video');
      videoElement.srcObject = remoteStream;
      peerConnection.addEventListener('track', track => {
        console.log({ caller: { track } });
        remoteStream.addTrack(track.track, remoteStream);
      });
      peerConnection.addEventListener('iceconnectionstatechange', () => {
        if (
          peerConnection.iceConnectionState === 'failed' ||
          peerConnection.iceConnectionState === 'disconnected' ||
          peerConnection.iceConnectionState === 'closed'
        ) {
          setIsOnCall(false);
          peerConnection.close();
        }
      });
      window.socket.on('iceCandidate', async candidate => {
        if (candidate.candidate === selfCandidate) {
          console.log('same person');
          return;
        }
        await peerConnection.addIceCandidate(candidate.candidate);
      });
      // signalingChannel.addEventListener('message', async message => {
      //   if(message.iceCandidate) {
      //     try {
      //       await peerConnection.addIceCandidate(message.addIceCandidate);
      //     } catch (error) {
      //     }
      //   }
      // })
      window.socket.on('answer', async ({ answer }) => {
        if (answer) {
          console.log({ answer });
          const remoteDesc = new RTCSessionDescription(answer);
          await peerConnection.setRemoteDescription(remoteDesc);
        }
      });
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      const connectWith = document.querySelector('#other-username');
      console.log({ offer });
      window.socket.emit('offer', { offer, to: connectWith.value });

      peerConnection.addEventListener('icecandidateerror', event => {
        console.log({ error: event });
        alert(`Something went wrong. Couldn't connect the call. Please try again.`);
      });
    } catch (error) {
      console.log({ error });
      alert(`Something went wrong. Couldn't connect the call. Please try again.`);
    }
  }

  async function answerCall() {
    try {
      if (window.caller) return;
      const configuration = {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      };
      const peerConnection = new RTCPeerConnection(configuration);
      document.querySelector('#disconnect').addEventListener('click', () => {
        peerConnection.close();
      });
      peerConnection.addEventListener('iceconnectionstatechange', () => {
        if (
          peerConnection.iceConnectionState === 'failed' ||
          peerConnection.iceConnectionState === 'disconnected' ||
          peerConnection.iceConnectionState === 'closed'
        ) {
          setIsOnCall(false);
          peerConnection.close();
        }
      });
      // let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      const selfVideoElement = document.querySelector('video#self-video');
      const cameraId = document.querySelector('select#availableCameras').value;
      const stream = await openCamera(cameraId, 480, 240);
      peerConnection.addStream(stream);
      // peerConnection.addEventListener('icecandidate', event => {
      //   if (event.candidate) {
      //     // console.log(`ICE Candidate:`, event.candidate, window.socket.emit)
      //     selfCandidate = event.candidate.candidate;
      //     const connectWith = document.querySelector('#other-username');
      //     window.socket.emit('new-ice-candidate', { candidate: event.candidate, to: connectWith.value });
      //   }
      // });
      const remoteStream = new MediaStream();
      const videoElement = document.querySelector('video#other-video');
      videoElement.srcObject = remoteStream;
      peerConnection.addEventListener('track', track => {
        console.log({ answerer: { track } });
  
        remoteStream.addTrack(track.track, remoteStream);
      });
      let selfCandidate = '';
      window.socket.on('offer', async ({ offer, from }) => {
        console.log({ from, offer });
        if (offer) {
          peerConnection.addEventListener('icecandidate', event => {
            if (event.candidate) {
              // console.log(`ICE Candidate:`, event.candidate, window.socket.emit)
              selfCandidate = event.candidate.candidate;
              const connectWith = document.querySelector('#other-username');
              window.socket.emit('new-ice-candidate', { candidate: event.candidate, to: from });
            }
          });
          peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
          document.querySelector('#caller-details').innerHTML = from + ' calling';
          document.querySelector('#answer').addEventListener('click', async () => {
            setIsOnCall(true);
            selfVideoElement.srcObject = stream;
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            const connectWith = document.querySelector('#other-username');
            window.socket.emit('answer', { answer, to: from });
            document.querySelector('#caller-details').innerHTML = '';
          });
        }
      });
      peerConnection.addEventListener('icecandidateerror', event => {
        console.log({ error: event });
        alert(`Something went wrong. Couldn't connect the call. Please try again.`);
      });
    } catch (error) {
      console.log({ error });
      alert(`Something went wrong. Couldn't connect the call. Please try again.`);
    }
  }
  // Initialize
  async function init() {
    try {
      document.querySelector('button#start').addEventListener('click', playVideoFromCamera);
      const videoCameras = await getConnectedDevices('videoinput');
      updateCameraList(videoCameras);
      navigator.mediaDevices.addEventListener('devicechange', event => {
        const newCameraList = getConnectedDevices('video');
        updateCameraList(newCameraList);
      });
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
      let hidden = ['start', 'self-video', 'other-video', 'availableCameras', 'other-username'];
      let show = ['submit', 'username'];
      window.socket = window.io('https://mubashir-video-chat.herokuapp.com/');
      let submitInput = document.querySelector('button#submit');
      submitInput.addEventListener('click', () => {
        let usernameInput = document.querySelector('input#username');
        console.log({ username: usernameInput.value });
        window.socket.emit('register', usernameInput.value);
      });
      // hidden.map(id => {
      //   document.querySelector('#' + id).style.visibility = 'hidden';
      // });
      window.socket.on('invalid_registration', message => {
        alert(message);
      });
      window.socket.on('invalid_message', message => {
        // hidden.map(id => {
        //   document.querySelector('#' + id).hidden = true;
        // });
        // show.map(id => {
        //   document.querySelector('#' + id).hidden = false;
        // });
        // alert(message);
      });
      window.socket.on('successful_registration', message => {
        // hidden.map(id => {
        //   document.querySelector('#' + id).style.visibility = 'visible';
        // });
        // show.map(id => {
        //   document.querySelector('#' + id).style.visibility = 'hidden';
        // });
        alert(message);
      });
      init();
      answerCall();
    }
    return () => {};
  });
  return (
    <div>
      <input className="padding" id="username" type="text" placeholder="Select your username" />
      <button id="submit" placeholder="username">
        Submit
      </button>
      <div className={isOnCall ? 'padding hidden' : 'padding'}>
        <select name="" id="availableCameras" placeholder="Choose camera"></select>
      </div>
      <div className={isOnCall ? 'padding hidden' : 'padding'}>
        <input id="other-username" type="text" placeholder="Connect with" />
        <button id="start">Start</button>
      </div>
      <div id="caller-details"></div>
      <button id="answer">Answer</button>
      <div className={isOnCall ? '' : 'hidden'}>
        <video id="self-video" autoPlay playsInLine controls="false"></video>
        <video id="other-video" autoPlay playsInLine controls="false"></video>
        <button id="disconnect">Disconnect</button>
      </div>
    </div>
  );
};
