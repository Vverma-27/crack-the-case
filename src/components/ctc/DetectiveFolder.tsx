"use client";
import { useRef, Suspense, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Environment,
  SpotLight,
  Float,
  OrbitControls,
  AdaptiveDpr,
  AdaptiveEvents,
  BakeShadows,
} from "@react-three/drei";
import * as THREE from "three";

type Page = {
  title: string;
  content: string[];
  gapY?: number;
};

// Sample content for the case file pages
const casePages: Page[] = [
  {
    title: "CASE SUMMARY",
    content: [
      "DATE: April 12, 2025",
      "LOCATION: Frostwick Harbor",
      "VICTIM: Marcus Holloway",
      "STATUS: Open Investigation",
      "DETECTIVE: J. Burnwall",
    ],
  },
  {
    title: "EVIDENCE LOG",
    content: [
      "ITEM #1: Torn photograph",
      "ITEM #2: Encrypted USB drive",
      "ITEM #3: Handwritten note",
      "ITEM #4: Partial fingerprint",
      "ITEM #5: Security footage (time 22:43-23:17)",
    ],
  },
  {
    title: "SUSPECT PROFILES",
    content: [
      "Victor Reynolds - Business rival, alibi unconfirmed",
      "Eliza Thornton - Ex-partner, financial motive",
      "Raymond Walsh - Security contractor, access to building",
      "Alexis Kim - Lab technician, discovered evidence",
    ],
    gapY: 1.2,
  },
  {
    title: "CASE TIMELINE",
    content: [
      "19:30 - Victim leaves office",
      "20:15 - Witness spots victim at harbor café",
      "21:45 - Last phone activity from victim",
      "22:30 - Security camera malfunction",
      "23:45 - Anonymous tip received",
    ],
  },
];

// Custom hook for detecting mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
};

// Optimized texture loader with memoization
const TextureLoader = () => {
  const [textures, setTextures] = useState({
    paper: null,
    stamp: null,
    shield: null,
  });

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // Use lower resolution textures for mobile
    const isMobile = window.innerWidth < 768;
    const quality = isMobile ? "?quality=low" : "";

    Promise.all([
      loader.loadAsync(`/textures/old-paper.jpg${quality}`),
      loader.loadAsync(`/textures/approved.png${quality}`),
      loader.loadAsync(`/textures/shield.png${quality}`),
    ]).then(([paper, stamp, shield]) => {
      paper.wrapS = paper.wrapT = THREE.RepeatWrapping;

      // Lower anisotropy for mobile
      if (!isMobile) {
        const maxAnisotropy = 4;
        paper.anisotropy = maxAnisotropy;
        stamp.anisotropy = maxAnisotropy;
        shield.anisotropy = maxAnisotropy;
      }

      setTextures({ paper, stamp, shield });
    });
  }, []);

  return textures;
};

const FolderModel = ({ isMobile }) => {
  const folderRef = useRef<THREE.Group>(null);
  const frontCoverRef = useRef<THREE.Mesh>(null);
  const backCoverRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const folderWidth = 7; // Width of the folder

  // State for folder animations and page navigation
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(1);
  const [showContent, setShowContent] = useState(true);

  // Get Three.js context for raycasting
  const { raycaster, camera, gl } = useThree();

  // Optimized animation frame with reduced calculations for mobile
  useFrame((state) => {
    if (!frontCoverRef.current || !folderRef.current || !backCoverRef.current)
      return;

    // Add subtle bobbing motion when not animating - reduced for mobile
    if (!isAnimating && folderRef.current) {
      const time = state.clock.getElapsedTime();
      // Less frequent updates for mobile
      if (!isMobile || time % 2 < 0.1) {
        folderRef.current.position.y =
          Math.sin(time * 0.6) * (isMobile ? 0.1 : 0.15);
        folderRef.current.rotation.z =
          Math.sin(time * 0.3) * (isMobile ? 0.005 : 0.01);
      }
    }

    if (isAnimating) {
      // Calculate target rotations based on open/close state
      const targetRotation = isOpen ? Math.PI : 0.1;
      const currentRotation = frontCoverRef.current.rotation.z;

      // Calculate target positions based on open/close state
      const targetOffsetX = isOpen ? 2.5 : 0;
      const targetOffsetZ = isOpen ? -0.5 : 0; // Target z position when open to match back cover
      const targetOffsetY = isOpen ? -0.2 : 0;

      // Faster animations on mobile
      const lerpFactor = isMobile ? 0.15 : 0.1;
      frontCoverRef.current.rotation.z = THREE.MathUtils.lerp(
        currentRotation,
        targetRotation,
        lerpFactor
      );

      // Set the pivot point for front cover
      frontCoverRef.current.position.x = THREE.MathUtils.lerp(
        frontCoverRef.current.position.x,
        (-folderWidth / 2) * (1 - Math.cos(frontCoverRef.current.rotation.z)) +
          targetOffsetX,
        lerpFactor
      );

      // Smoothly adjust z position toward target
      frontCoverRef.current.position.z = THREE.MathUtils.lerp(
        frontCoverRef.current.position.z,
        (folderWidth / 2) * Math.sin(frontCoverRef.current.rotation.z) +
          targetOffsetZ,
        lerpFactor
      );

      // Correctly lerp the y position
      frontCoverRef.current.position.y = THREE.MathUtils.lerp(
        frontCoverRef.current.position.y, // Fix: was using position.z
        targetOffsetY, // Just use the direct target offset
        lerpFactor
      );

      // Also move back cover to the right
      backCoverRef.current.position.x = THREE.MathUtils.lerp(
        backCoverRef.current.position.x,
        targetOffsetX,
        lerpFactor
      );

      // Check if animation is complete
      if (Math.abs(frontCoverRef.current.rotation.z - targetRotation) < 0.01) {
        setIsAnimating(false);
        // Snap to exact values when animation is done
        frontCoverRef.current.rotation.z = targetRotation;

        if (isOpen) {
          // Set exact positions for opened state
          frontCoverRef.current.position.x = -folderWidth + targetOffsetX;
          frontCoverRef.current.position.z = -0.5;
          frontCoverRef.current.position.y = -0.2; // Set y position when open
          backCoverRef.current.position.x = targetOffsetX;

          // Shorter fade-in time for mobile
          setTimeout(
            () => {
              setShowContent(true);
              setContentOpacity(1);
            },
            isMobile ? 100 : 300
          );
        } else {
          // Reset all positions when closed
          frontCoverRef.current.position.x = 0;
          frontCoverRef.current.position.z = 0;
          frontCoverRef.current.position.y = 0; // IMPORTANT: Reset y position when closed
          backCoverRef.current.position.x = 0;

          setTimeout(
            () => {
              setShowContent(true);
              setContentOpacity(1);
            },
            isMobile ? 100 : 300
          );
        }
      }
    }
  });

  // Optimized click handler
  const handleClick = useCallback(
    (event: MouseEvent) => {
      // Calculate normalized mouse coordinates for raycasting
      const mouse = new THREE.Vector2();
      const rect = gl.domElement.getBoundingClientRect();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with our folder meshes
      if (frontCoverRef.current && backCoverRef.current) {
        const intersects = raycaster.intersectObjects([
          frontCoverRef.current,
          backCoverRef.current,
        ]);

        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;

          // If front cover is clicked
          if (clickedObject === frontCoverRef.current) {
            // Fast transition on mobile
            if (isMobile) {
              setContentOpacity(0);
              setShowContent(false);
              setIsAnimating(true);
              setIsOpen(!isOpen);
            } else {
              // Start fade-out before animation
              const fadeOut = () => {
                setContentOpacity((prevOpacity) => {
                  const newOpacity = Math.max(prevOpacity - 0.1, 0);
                  if (newOpacity > 0) {
                    requestAnimationFrame(fadeOut);
                  } else {
                    setShowContent(false);
                    setIsAnimating(true);
                    setIsOpen(!isOpen);
                  }
                  return newOpacity;
                });
              };
              fadeOut();
            }
          }

          // If back cover is clicked when folder is open
          if (clickedObject === backCoverRef.current && isOpen && showContent) {
            // Fast page change on mobile
            if (isMobile) {
              setContentOpacity(0);
              setTimeout(() => {
                const nextPage = (currentPage + 1) % casePages.length;
                setCurrentPage(nextPage);
                setContentOpacity(1);
              }, 100);
            } else {
              // Fade out current page
              const fadeOut = () => {
                setContentOpacity((prevOpacity) => {
                  const newOpacity = Math.max(prevOpacity - 0.1, 0);
                  if (newOpacity > 0) {
                    requestAnimationFrame(fadeOut);
                  } else {
                    const nextPage = (currentPage + 1) % casePages.length;
                    setCurrentPage(nextPage);
                    setTimeout(() => {
                      setContentOpacity(1); // Instant on desktop too for simplicity
                    }, 200);
                  }
                  return newOpacity;
                });
              };
              fadeOut();
            }
          }
        }
      }
    },
    [isOpen, currentPage, isAnimating, showContent, isMobile]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  // Reset content visibility when open/close state changes
  useEffect(() => {
    if (isAnimating) {
      setContentOpacity(0);
      setShowContent(false);
    }
  }, [isOpen, isAnimating]);

  const textures = TextureLoader();

  if (!textures.paper || !textures.stamp || !textures.shield) {
    return null; // Render nothing until textures are loaded
  }

  // Create a more optimized folder for mobile
  return (
    <group ref={folderRef}>
      {/* Single spotlight for mobile */}
      {/* {!isMobile && ( */}
      <SpotLight
        ref={spotLightRef}
        position={[0, 10, 5]}
        intensity={80}
        angle={Math.PI / 2}
        penumbra={1}
        distance={20}
        castShadow
        shadow-mapSize={[512, 512]} // Reduced resolution
        color="#fff"
      />
      {/* )} */}

      {/* Back cover - static with rounded edges */}
      <mesh
        position={[0, -0.2, -0.5]}
        castShadow={!isMobile}
        receiveShadow={!isMobile}
        ref={backCoverRef}
        rotation={[Math.PI / 2.4, 0, 0]}
      >
        <boxGeometry args={[folderWidth, 0.2, 10]} />
        <meshStandardMaterial
          map={textures.paper}
          color="#c9b18c"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Front cover - animated with rounded edges */}
      <mesh
        position={[0, 0, 0]}
        castShadow={!isMobile}
        ref={frontCoverRef}
        receiveShadow={!isMobile}
        rotation={[Math.PI / 2.4, 0, 0.1]} // Start at 0.1 rotation
      >
        <boxGeometry args={[folderWidth, 0.2, 10]} />
        <meshStandardMaterial
          map={textures.paper}
          color="#c9b18c"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Case File Content with opacity transition */}
      {showContent && isOpen ? (
        <group visible={contentOpacity > 0} position={[2.5, 0, 0]}>
          {/* Main content paper sheet - slightly larger for better readability */}
          <mesh
            position={[0, 0, 0]}
            castShadow={!isMobile}
            receiveShadow={!isMobile}
            rotation={[Math.PI / 2.4, 0, 0.1]}
          >
            <boxGeometry args={[6.8, 0.02, 9.2]} />
            <meshStandardMaterial
              color="#f5f5f0"
              roughness={0.6}
              metalness={isMobile ? 0 : 1}
              transparent={true}
              opacity={contentOpacity}
            />
          </mesh>

          {/* Page title on paper - moved higher and bigger */}
          <Text
            position={[0, 3.2, -0.4]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.68}
            color="#2a2520"
            font="/fonts/Roboto-Bold.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity}
          >
            {casePages[currentPage].title}
          </Text>

          {/* Add decorative line under title */}
          <mesh position={[0, 2.7, -0.2]} rotation={[-0.3, -0.1, 0]}>
            <planeGeometry args={[5, 0.05]} />
            <meshStandardMaterial
              color="#2a2520"
              transparent={true}
              opacity={contentOpacity * 0.7}
            />
          </mesh>

          {/* Content lines on paper - better spacing */}
          {casePages[currentPage].content.map((line, index) => (
            <Text
              key={index}
              position={[
                0, // Centered horizontally
                1.8 - index * (casePages[currentPage].gapY || 1.0), // Increased vertical spacing
                0.2 + index * 0.05, // Subtle depth progression
              ]}
              rotation={[-0.3, -0.1, 0]}
              fontSize={0.45} // Slightly larger text
              color="#2a2520"
              font="/fonts/Roboto-Regular.woff"
              anchorX="center"
              anchorY="middle"
              maxWidth={5.5} // Wider text bounds
              textAlign="center" // Center align text
              fillOpacity={contentOpacity}
            >
              {line}
            </Text>
          ))}

          {/* Page indicators on paper - repositioned */}
          <Text
            position={[2.2, -3.5, 1.2]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.36}
            color="#2a2520"
            font="/fonts/Roboto-Bold.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity}
          >
            {`Page ${currentPage + 1}/${casePages.length}`}
          </Text>

          {/* Add a hint at the bottom */}
          <Text
            position={[-1.8, -3.5, 1.2]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.36}
            color="#5a4530"
            font="/fonts/Roboto-Italic.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity * 0.8}
          >
            Click to continue
          </Text>

          {/* Improved stacked papers with better positioning */}
          {Array.from({ length: 3 }).map((_, index) => (
            <mesh
              key={index}
              position={[0, -0.15 - index * 0.05, -0.2 - index * 0.1]}
              castShadow
              receiveShadow
              rotation={[Math.PI / 2.4, 0, 0.1 - ((index + 1) * 0.08) / 6]}
            >
              <boxGeometry args={[6.5, 0.01, 9]} />
              <meshStandardMaterial
                color={`rgb(${245 - index * 18}, ${245 - index * 18}, ${
                  240 - index * 12
                })`}
                roughness={0.5}
                metalness={1}
                transparent={true}
                opacity={contentOpacity * (0.9 - index * 0.15)}
              />
            </mesh>
          ))}

          <PaperClips isOpen={true} contentOpacity={contentOpacity} />
        </group>
      ) : showContent && !isOpen ? (
        // When closed, show text on the front cover with opacity transition
        <group visible={contentOpacity > 0}>
          <Text
            position={[0, 2.4, -0.4]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.4}
            color="#2a2520"
            font="/fonts/Roboto-Bold.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity}
          >
            BOOK 4
          </Text>

          <Text
            position={[0, 1.8, -0.2]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.32}
            color="#2a2520"
            font="/fonts/Roboto-Regular.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity}
          >
            DETECTIVE BURNWALL
          </Text>

          <Text
            position={[0, 1, 0.1]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.7}
            color="#2a2520"
            font="/fonts/Roboto-Bold.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity}
          >
            CASE FILE
          </Text>

          <Text
            position={[0, -3.2, 1]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.5}
            color="#2a2520"
            font="/fonts/Roboto-Bold.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity}
          >
            B.T. FROST
          </Text>

          {/* Fewer paper sheets on mobile */}
          {isMobile ? (
            <mesh
              position={[0, -0.1, -0.25]}
              castShadow={false}
              receiveShadow={false}
              rotation={[Math.PI / 2.4, 0, 0.1]}
            >
              <boxGeometry args={[6.5, 0.01, 9]} />
              <meshStandardMaterial
                color={"#e8e8e0"}
                roughness={0.5}
                metalness={0}
                transparent={true}
                opacity={contentOpacity * 0.9}
              />
            </mesh>
          ) : (
            // Multiple thin paper sheets for detail
            Array.from({ length: 5 }).map((_, index) => (
              <mesh
                key={index}
                position={[0, -0.1 - index * 0.02, -0.25]}
                castShadow
                receiveShadow
                rotation={[Math.PI / 2.4, 0, 0.1 - index * 0.02]}
              >
                <boxGeometry args={[6.5, 0.01, 9]} />
                <meshStandardMaterial
                  color={`rgb(${245 - index * 15}, ${245 - index * 15}, ${
                    240 - index * 9
                  })`}
                  roughness={0.5}
                  metalness={1}
                  transparent={true}
                  opacity={contentOpacity * 0.9}
                />
              </mesh>
            ))
          )}

          {/* Shield Emblem */}
          <mesh position={[0, -0.9, 0.5]} rotation={[-0.3, -0.1, 0]}>
            <planeGeometry args={[4, 4]} />
            <meshBasicMaterial
              map={textures.shield}
              transparent={true}
              opacity={contentOpacity * 0.9}
              depthWrite={true}
            />
          </mesh>

          {/* APPROVED Stamp */}
          <mesh
            position={[-1.4, 3.2, -0.7]}
            rotation={[-0.3, -0.1, Math.PI / 8]}
          >
            <planeGeometry args={[3, 1.5]} />
            <meshBasicMaterial
              map={textures.stamp}
              transparent={true}
              opacity={contentOpacity * 0.9}
              color="#bd2c14"
            />
          </mesh>

          <PaperClips isOpen={false} contentOpacity={contentOpacity} />
          {/* Worn edges - only on desktop */}
          {!isMobile && (
            <mesh position={[3.1, -0.5, 0.68]} rotation={[-0.25, 0, 0]}>
              <planeGeometry args={[0.8, 6]} />
              <meshStandardMaterial
                color="#af9a7a"
                roughness={1}
                opacity={contentOpacity * 0.7}
                transparent={true}
              />
            </mesh>
          )}

          <Text
            position={[0, -4, 1.3]}
            rotation={[-0.3, -0.1, 0]}
            fontSize={0.45}
            color="#fff"
            font="/fonts/Roboto-Italic.woff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={contentOpacity}
          >
            Click folder to open
          </Text>
        </group>
      ) : null}
    </group>
  );
};

// Add this as a separate component for reusability
const PaperClips = ({ isOpen, contentOpacity }) => {
  const clipBaseStyles = {
    color: "#888888",
    metalness: 1,
    roughness: 0.2,
    transparent: true,
    opacity: contentOpacity,
  };

  // Positions and rotations based on folder state
  const clipPositions = isOpen
    ? [
        // When open - shifted to the right side
        [-3.5, 4, -1.8, Math.PI / 2.5, 0, Math.PI / 1.15],
        [-3.5, 0, -0.6, Math.PI / 2.5, 0, Math.PI / 1.15],
        [-3.5, -4, 0.3, Math.PI / 2.5, 0, Math.PI / 1.15],
      ]
    : [
        // When closed - on the left side
        [-3.5, 4, -1.5, Math.PI / 2.5, 0, Math.PI / 4],
        [-3.5, 0, -0.45, Math.PI / 2.5, 0, Math.PI / 4],
        [-3.5, -4, 0.6, Math.PI / 2.5, 0, Math.PI / 4],
      ];

  return (
    <>
      {clipPositions.map((pos, index) => (
        <mesh
          key={index}
          position={[pos[0], pos[1], pos[2]]}
          rotation={[pos[3], pos[4], pos[5]]}
        >
          <torusGeometry args={[0.3, 0.12, 8, 16, Math.PI * 1.3]} />
          <meshStandardMaterial {...clipBaseStyles} />
        </mesh>
      ))}
    </>
  );
};

// Floor model - only shown on desktop
const FloorModel = () => {
  return (
    <group position={[0, -5.5, 0]}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[10, 10, 0.5, 16]} />
        <meshStandardMaterial color="#4a2f1a" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[10.5, 10.5, 0.2, 16]} />
        <meshStandardMaterial color="#8b6f47" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
};

const DetectiveFolder = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-[50vh] md:h-[80vh]">
      <Canvas
        shadows={!isMobile} // Disable shadows on mobile
        camera={{
          position: [0, 10, isMobile ? 28 : 38], // Move camera back on mobile
          fov: isMobile ? 30 : 35, // Reduce FOV on mobile
        }}
        gl={{
          antialias: !isMobile, // Disable antialiasing on mobile
          preserveDrawingBuffer: false,
          powerPreference: "high-performance", // Prefer performance over battery life
        }}
        dpr={[1, isMobile ? 1.5 : 2]} // Lower max pixel ratio on mobile
      >
        {/* Simplified lighting for mobile */}

        <>
          <SpotLight
            position={[5, 10, 2]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[512, 512]} // Reduced from 1024
          />
          <SpotLight
            position={[-5, 10, 2]}
            angle={0.15}
            penumbra={1}
            intensity={0.5}
            castShadow
            shadow-mapSize={[512, 512]} // Reduced from 1024
          />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={0.7}
            castShadow
            shadow-mapSize={[512, 512]} // Reduced from 1024
            shadow-camera-far={15}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
          />
        </>

        <Suspense fallback={null}>
          {/* Simplified Float for mobile */}
          {isMobile ? (
            <FolderModel isMobile={isMobile} />
          ) : (
            <Float
              speed={1.5}
              rotationIntensity={0}
              floatIntensity={1.5}
              floatingRange={[-0.2, 0.2]}
            >
              <FolderModel isMobile={isMobile} />
            </Float>
          )}

          {/* Only show floor on desktop */}
          {!isMobile && <FloorModel />}

          {/* Use simpler environment on mobile */}
          <Environment preset={isMobile ? "warehouse" : "city"} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          target={[0, 1, 0]}
          // More responsive controls on mobile
          rotateSpeed={isMobile ? 0.7 : 1}
          dampingFactor={isMobile ? 0.1 : 0.05}
        />

        {/* Adaptive resolution */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        {/* Only bake shadows on desktop */}
        {!isMobile && <BakeShadows />}
      </Canvas>
    </div>
  );
};

export default DetectiveFolder;
