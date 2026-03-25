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

  // Load model
  useEffect(() => {
    if (!modelPath || !sceneRef.current) return

    setIsLoading(true)
    const loader = new GLTFLoader()

    const defaultModelPath = '/models/lamborghini_aventador_2012.glb'
    const pathToLoad = modelPath || defaultModelPath

    loader.load(
      pathToLoad,
      (gltf) => {
        // Remove old model
        if (modelRef.current) {
          sceneRef.current!.remove(modelRef.current)
        }

        const model = gltf.scene
        model.castShadow = true
        model.receiveShadow = true

        // Apply materials to all meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material instanceof THREE.Material) {
              child.material.side = THREE.DoubleSide
            }
          }
        })

        sceneRef.current!.add(model)
        modelRef.current = model

        // Center and scale model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 3 / maxDim
        model.scale.multiplyScalar(scale)

        setIsLoading(false)
      },
      (progress) => {
        console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`)
      },
      (error) => {
        console.error('Model loading error:', error)
        setIsLoading(false)
      }
    )
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
