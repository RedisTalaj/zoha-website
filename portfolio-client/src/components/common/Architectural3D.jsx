import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, OrbitControls, useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { PointLightHelper } from 'three';

function Scene() {
    const meshRef = useRef();
    const pointLightRef = useRef();

    // Rotate the mesh every frame
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x += delta * 0.1;
        }
    });
    
    // Uncomment to see a helper for the light source
    // useHelper(pointLightRef, PointLightHelper, 1)

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight ref={pointLightRef} position={[5, 5, 5]} intensity={150} />
            <TorusKnot ref={meshRef} args={[2.5, 0.5, 256, 32]}>
                <meshStandardMaterial color="#bb86fc" roughness={0.3} metalness={0.6} />
            </TorusKnot>
        </>
    );
}

function Architectural3D() {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <Scene />
            {/* <OrbitControls enableZoom={false} />  // Uncomment to allow manual rotation */}
        </Canvas>
    );
}

export default Architectural3D;