// ******************************************************
// 
//         Restaurant website demo
//    
//          ringoQED, 22 Mar 2025
//          Updated: 16 Nov 2025
//          Updated: 20 Mar 2026
//          Updated: 26 Mar 2026
//          Updated: 03 Apr 2026
//          Updated: 08 May 2026
// 
// 
// ******************************************************

import { Canvas, useThree, useFrame, useLoader, extend } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useRef, useEffect, useState, Suspense } from 'react';
import { Stats, OrbitControls, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { GUI } from 'lil-gui';

//Load the food photos as cube textures
import img1 from './assets/images/main_menu.jpg';
import img2 from './assets/images/map_london.jpg';
import img3 from './assets/images/food_03.jpg'; //dummy image for the cube, not used in the menu
import img4 from './assets/images/food_04.jpg'; //dummy image for the cube, not used in the menu
import img5 from './assets/images/about.jpg';
import img6 from './assets/images/booking.png';

//Load the restaurant hdr images as background
import restaurant1 from './assets/images/restaurant1.hdr';
import restaurant2 from './assets/images/restaurant2.hdr';
import restaurant3 from './assets/images/restaurant3.hdr';

//Load the restaurant menus image
import menu_main from './assets/images/menu_main.jpg';
import menu_starter from './assets/images/menu_starter.jpg';
import menu_dessert from './assets/images/menu_dessert.jpg';
import menu_drink from './assets/images/menu_drink.jpg';
import { Fragment } from 'react';


const modelRotationSpeed = 0.002; // Adjust the rotation speed of the models

//Load the Spaghetti model
function ModelSpag({ isSpagVisible, onSpagClick }) {
  const modelSpagRef = useRef();
  const gltf = useLoader( GLTFLoader, "/spaghetti/scene.gltf" );

  useFrame(() => (modelSpagRef.current.rotation.y += modelRotationSpeed));

  return (   
    <primitive 
        onPointerDown = { (e) => {
          e.stopPropagation();
          onSpagClick();
        }}
        ref = { modelSpagRef }
        object={ gltf.scene } 
        scale={ 0.007 } 
        position={[ 0, 1, 3 ]}
        visible={ isSpagVisible }
    />   
  );
};


//Load the Oyster model
function ModelOyster({ isOysterVisible, onOysterClick }) {
  const modelOysterRef = useRef();
  const gltf = useLoader( GLTFLoader, "/oyster/scene.gltf" );

  useFrame(() => (modelOysterRef.current.rotation.y += modelRotationSpeed));

  return (   
    <primitive 
        onPointerDown = { (e) => {
          e.stopPropagation();
          onOysterClick();
        }}
        ref = { modelOysterRef }
        object={ gltf.scene } 
        scale={ 5 } 
        position={[ 3, -1, 0 ]}
        visible={ isOysterVisible }
    />   
  );
};


//Load the Dessert model
function ModelDessert({ isDessertVisible, onDessertClick }) {
  const modelDessertRef = useRef();
  const gltf = useLoader( GLTFLoader, "/dessert/scene.gltf" );

  useFrame(() => (modelDessertRef.current.rotation.y += modelRotationSpeed));

  return (   
    <primitive 
        onPointerDown = { (e) => {
          e.stopPropagation();
          onDessertClick();
        }}
        ref = { modelDessertRef }
        object={ gltf.scene } 
        scale={ 1 } 
        position={[ 0, -1, -3 ]}
        visible={ isDessertVisible }
    />   
  );
};


//Load the Drink model
function ModelDrink({ isDrinkVisible, onDrinkClick }) {
  const modelDrinkRef = useRef();
  const gltf = useLoader( GLTFLoader, "/drink/scene.gltf" );

  useFrame(() => (modelDrinkRef.current.rotation.y += modelRotationSpeed));

  return (   
    <primitive 
        onPointerDown = { (e) => {
          e.stopPropagation();
          onDrinkClick();
        }}
        ref = { modelDrinkRef }
        object={ gltf.scene } 
        scale={ 0.03 } 
        position={[ -3, -1.5, 0 ]}
        visible={ isDrinkVisible }
    />   
  );
};


// Control menu to select different restaurants as background
function CtrlMenu ({ setBackground }){

  useEffect(() => {

    const obj = {

      Background: 'Restaurant',

    };
  
  const gui = new GUI();

  gui.add( obj, 'Background', ['Restaurant1', 'Restaurant2', 'Restaurant3'] ).onFinishChange( value => {
    switch( value ) {
      case 'Restaurant1':
        setBackground( restaurant1 );
        break;
      case 'Restaurant2':
        setBackground( restaurant2 );
        break;
      case 'Restaurant3':
        setBackground( restaurant3 );
        break;
    }    
  })
  
  return () => {
    gui.destroy()
  }
}, [setBackground])
}


//Define the cube and show the food menu when cube is clicked
function Box({ onCubeClick, onBookingClick }) {
  const meshRef = useRef();
  const textures = useLoader( TextureLoader, [img1, img2, img3, img4, img5, img6] );
  const [hovered, setHovered] = useState(false);

  // Sync the global body cursor with the hover state
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    
    // Cleanup to reset cursor if the component unmounts (no effect in this case since Box is always mounted, but good practice)
    //return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  return (
    <mesh ref={meshRef} 
      onPointerDown = {(e) => {
        //console.log("Cube clicked");
        e.stopPropagation(); // Prevent click from passing through to the canvas
      const normal = e.face.normal; // Check which face of the cube was clicked based on the normal vector
      console.log('Clicked face normal:', normal);
      if (normal.x > 0.5) {
        
        console.log("Menu clicked");
        onCubeClick();  // Redirected to handleCubeClick() to toggle the menu visibility and blur effect

      } else if (normal.x < -0.5) {
        console.log("Find Us clicked");
        window.open('https://www.google.co.uk/maps/place/Eat+Tokyo+(Soho)/@51.5131066,-0.1365974,15.6z/data=!3m1!5s0x487604d2bdb90531:0xfe2bb5b59bd6eee4!4m6!3m5!1s0x487604d2ed0c6601:0xa3e0d243e40a8107!8m2!3d51.5137149!4d-0.130203!16s%2Fg%2F1hm5_znjh?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D', '_blank');
      } else if (normal.y > 0.5) {
        console.log("Top face clicked");
      } else if (normal.y < -0.5) {
        console.log("Bottom face clicked");
      } else if (normal.z > 0.5) {
        console.log("About clicked");
      } else if (normal.z < -0.5) {
        console.log("Booking clicked");
        onBookingClick();
      }
  
      }}

      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >

      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial attach="material-0" map={textures[0]} />
      <meshStandardMaterial attach="material-1" map={textures[1]} />
      <meshStandardMaterial attach="material-2" map={textures[2]} />
      <meshStandardMaterial attach="material-3" map={textures[3]} />
      <meshStandardMaterial attach="material-4" map={textures[4]} />
      <meshStandardMaterial attach="material-5" map={textures[5]} />
    </mesh>
  );
}

//Load the menu textures to create the food menus
function FoodMenu({ isVisible }) {
  const menu_mainRef = useRef();
  const menu_starterRef = useRef();
  const menu_dessertRef = useRef();
  const menu_drinkRef = useRef();

  const textureMain = useRef(new THREE.TextureLoader().load( menu_main ));
  const textureStarter = useRef(new THREE.TextureLoader().load( menu_starter ));
  const textureDessert = useRef(new THREE.TextureLoader().load( menu_dessert ));
  const textureDrink = useRef(new THREE.TextureLoader().load( menu_drink ));

  // Position the menus around the cube
  return (
    <Fragment>
      <mesh ref={ menu_mainRef } position={[ 0, 0, 2.5 ]} visible={ isVisible } >
        <planeGeometry args={[3, 3.5]} />
        <meshBasicMaterial
          map={ textureMain.current }
          side={ THREE.DoubleSide }
        />
      </mesh>

      <mesh ref={ menu_starterRef } position={[ 2.5, 0, 0 ]} rotation={[0, Math.PI / 2, 0]} visible={ isVisible } >
        <planeGeometry args={[3, 3.5]} />
        <meshBasicMaterial
          map={ textureStarter.current }
          side={ THREE.DoubleSide }
        />
      </mesh>

      <mesh ref={ menu_dessertRef } position={[ 0, 0, -2.5 ]} rotation={[0, Math.PI, 0]} visible={ isVisible } >
        <planeGeometry args={[3, 3.5]} />
        <meshBasicMaterial
          map={ textureDessert.current }
          side={ THREE.DoubleSide }
        />  
      </mesh>

      <mesh ref={ menu_drinkRef } position={[ -2.5, 0, 0 ]} rotation={[0, -Math.PI / 2, 0]} visible={ isVisible } >
        <planeGeometry args={[3, 3.5]} />
        <meshBasicMaterial
          map={ textureDrink.current }
          side={ THREE.DoubleSide }
        />  
      </mesh>      
    </Fragment>
  );
}


// Set camera's initial position
function SetCamera() {
  const { set, camera } = useThree();

  useEffect(() => {
    camera.position.set(4, 0, -4);
    set({ camera });
  }, []);
}

//Consolidate the features into App() function
function App() {
  const [ background, setBackground ] = useState( restaurant1 );
  const [ isBlur, setIsBlur ] = useState( 0 );
  const [ isMenuVisible, setIsMenuVisible ] = useState( false );
  const [ isSpagVisible, setIsSpagVisible ] = useState( false );
  const [ isOysterVisible, setIsOysterVisible ] = useState( false );
  const [ isDessertVisible, setIsDessertVisible ] = useState( false );
  const [ isDrinkVisible, setIsDrinkVisible ] = useState( false );

  const [ isBookingVisible, setIsBookingVisible ] = useState( false );
  const [ bookingDate, setBookingDate ] = useState('');
  const [ bookingTime, setBookingTime ] = useState('');
  const [ bookingPartySize, setBookingPartySize ] = useState(1);
  const [ bookingMessage, setBookingMessage ] = useState('');

  useEffect(() => {
    setIsBlur(isBookingVisible || isMenuVisible ? 0.1 : 0);
  }, [isBookingVisible, isMenuVisible]);

  // Handle clicks on food models
  const handleSpagClick = () => {
    //setIsMenuVisible( prev => !prev );
    console.log("Spaghetti clicked");
  }

  const handleOysterClick = () => {
    //setIsMenuVisible( prev => !prev );
    console.log("Oyster clicked");
  }

  const handleDessertClick = () => {
    //setIsMenuVisible( prev => !prev );
    console.log("Dessert clicked");
  }

  const handleDrinkClick = () => {
    //setIsMenuVisible( prev => !prev );
    console.log("Drink clicked");
  }

  const handleBookingClick = () => {
    setIsBookingVisible( prev => !prev );
  }

  const handleDateChange = (e) => {
    setBookingDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setBookingTime(e.target.value);
  };

  const handlePartySizeChange = (e) => {
    setBookingPartySize(parseInt(e.target.value, 10));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) {
      setBookingMessage('Please select a date and time.');
      return;
    }

    setBookingMessage(`Table booked for ${bookingPartySize} people on ${bookingDate} at ${bookingTime}.`);
    //setBookingDate('');
    //setBookingTime('');
    //setBookingPartySize(1);
  };

  const handleBookingReset = () => {
    setBookingDate('');
    setBookingTime('');
    setBookingPartySize(1);
    setBookingMessage('');
  };

  // Handle clicks on the cube
  const handleCubeClick = () => {

    setIsSpagVisible( prev => !prev );
    setIsOysterVisible( prev => !prev );
    setIsDessertVisible( prev => !prev );
    setIsDrinkVisible( prev => !prev );

    setIsMenuVisible( prev => !prev ); // Toggle menu visibility when cube is clicked

    setIsBlur( prev => !prev ? 0.1 : 0 ); // Toggle blur effect based on menu visibility
    
  };

  // Handle clicks on the canvas (outside the cube)
  const handleCanvasClick = () => {
    console.log("Canvas clicked");
   
    setIsMenuVisible( false ); // Hide the image when clicking outside
    setIsBlur( false ); // Remove blur effect when clicking outside
    
    setIsSpagVisible( false );
    setIsOysterVisible( false );
    setIsDessertVisible( false );
    setIsDrinkVisible( false );

    setIsBookingVisible( false );
  };
  
  return (
    <>
      <Canvas onPointerMissed={handleCanvasClick}>
        <Suspense fallback={ null }>
          <SetCamera />
          <ambientLight />
          <pointLight position={[ 10, 10, 10 ]} />
          <Box onCubeClick={ handleCubeClick } onBookingClick={ handleBookingClick } />
          <ModelSpag isSpagVisible={ isSpagVisible } onSpagClick={ handleSpagClick } />
          <ModelOyster isOysterVisible={ isOysterVisible } onOysterClick={ handleOysterClick } />
          <ModelDessert isDessertVisible={ isDessertVisible } onDessertClick={ handleDessertClick } />
          <ModelDrink isDrinkVisible={ isDrinkVisible } onDrinkClick={ handleDrinkClick } />
          <FoodMenu isVisible={ isMenuVisible } />
          <OrbitControls 
            enableZoom={ false } 
            enablePan={ false }
            autoRotate={ true } 
            autoRotateSpeed={ 0.1 }
            minPolarAngle={ Math.PI/2}
            maxPolarAngle={ Math.PI/2}
          />
          <CtrlMenu setBackground={ setBackground } />
          <Environment files={ background } background backgroundBlurriness={ isBlur } />
          <Stats />
        </ Suspense>
      </Canvas>

      {isBookingVisible && (
        <div className="booking-panel">
          <h2>Book Now!</h2>
          <form onSubmit={handleBookingSubmit}>
            <label>
              Date:
              <input type="date" value={bookingDate} onChange={handleDateChange} required />
            </label>
            <label>
              Time:
              <input type="time" value={bookingTime} onChange={handleTimeChange} required />
            </label>
            <label>
              Party Size:
              <input type="number" min="1" max="10" value={bookingPartySize} onChange={handlePartySizeChange} />
            </label>
            <div className="button-group">
              <button type="submit">Book Now</button>
              <button type="button" onClick={handleBookingReset}>Reset</button>
            </div>
          </form>
          {bookingMessage && <p className="booking-message">{bookingMessage}</p>}
        </div>
      )}
    </>
  );
}

export default App;

