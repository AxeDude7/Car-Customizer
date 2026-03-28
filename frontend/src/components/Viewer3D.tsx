import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './Viewer3D.css'

interface Viewer3DProps {
  modelPath?: string
  primaryColor?: string
  secondaryColor?: string | null
  onLoadingChange?: (loading: boolean) => void
}

const Viewer3D: React.FC<Viewer3DProps> = ({
  modelPath,
  primaryColor = '#0A0E27',
  secondaryColor = null,
  onLoadingChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading, onLoadingChange])

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a2e)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 2, 5)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowShadowMap
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.4)
    pointLight.position.set(-5, 5, 5)
    scene.add(pointLight)

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a4e,
      metalness: 0.1,
      roughness: 0.8,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = 2

    // Store references
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  // Create procedural car model
  const createCarModel = () => {
    const group = new THREE.Group()

    // Main body - use primaryColor
    const bodyGeom = new THREE.BoxGeometry(2, 1, 4)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: primaryColor || 0xff0000,
      metalness: 0.7,
      roughness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.5
    body.castShadow = true
    body.receiveShadow = true
    group.add(body)

    // Cabin/roof
    const cabinGeom = new THREE.BoxGeometry(1.6, 0.8, 1.8)
    const cabinMat = new THREE.MeshStandardMaterial({
      color: primaryColor || 0xff0000,
      metalness: 0.7,
      roughness: 0.2,
    })
    const cabin = new THREE.Mesh(cabinGeom, cabinMat)
    cabin.position.y = 1.4
    cabin.position.z = -0.3
    cabin.castShadow = true
    cabin.receiveShadow = true
    group.add(cabin)

    // Windows
    const windowGeom = new THREE.PlaneGeometry(1.4, 0.6)
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x87ceeb,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.6,
    })
    const window1 = new THREE.Mesh(windowGeom, windowMat)
    window1.position.set(0, 1.6, 0.5)
    window1.rotation.y = 0.1
    group.add(window1)

    // Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32)
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.5,
      roughness: 0.7,
    })

    const wheelPositions = [
      [-0.9, 0.4, 1.2],
      [0.9, 0.4, 1.2],
      [-0.9, 0.4, -1.2],
      [0.9, 0.4, -1.2],
    ]

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeom, wheelMat)
      wheel.position.set(...(pos as [number, number, number]))
      wheel.rotation.z = Math.PI / 2
      wheel.castShadow = true
      wheel.receiveShadow = true
      group.add(wheel)
    })

    // Bumpers
    const bumperGeom = new THREE.BoxGeometry(2, 0.3, 0.3)
    const bumperMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 0.6,
      roughness: 0.4,
    })
    const frontBumper = new THREE.Mesh(bumperGeom, bumperMat)
    frontBumper.position.set(0, 0.4, 2.2)
    group.add(frontBumper)

    const rearBumper = new THREE.Mesh(bumperGeom, bumperMat)
    rearBumper.position.set(0, 0.4, -2.2)
    group.add(rearBumper)

    return group
  }

  // Load model
  useEffect(() => {
    if (!sceneRef.current) return

    setIsLoading(true)

    // Remove old model
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current)
    }

    // Try to load real model if path provided
    if (modelPath) {
      const loader = new GLTFLoader()
      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene
          model.castShadow = true
          model.receiveShadow = true

          // Apply shadow to all children
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })

          sceneRef.current?.add(model)
          modelRef.current = model
          setIsLoading(false)
        },
        undefined,
        (error) => {
          // Fallback to procedural model if real model fails to load
          console.warn('Failed to load model, using procedural fallback:', error)
          const model = createCarModel()
          model.castShadow = true
          model.receiveShadow = true
          sceneRef.current?.add(model)
          modelRef.current = model
          setIsLoading(false)
        }
      )
    } else {
      // No model path provided, use procedural generation
      const model = createCarModel()
      model.castShadow = true
      model.receiveShadow = true

      sceneRef.current.add(model)
      modelRef.current = model

      setIsLoading(false)
    }
  }, [modelPath])

  // Update colors
  useEffect(() => {
    if (!modelRef.current) return

    const primaryColorObj = new THREE.Color(primaryColor)

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        // Apply primary color
        child.material.color = primaryColorObj
        child.material.metalness = 0.5
        child.material.roughness = 0.5
      }
    })
  }, [primaryColor, secondaryColor])

  return (
    <div className="viewer-3d-container" ref={containerRef}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      )}
    </div>
  )
}

export default Viewer3D
