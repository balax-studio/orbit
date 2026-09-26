import * as THREE from 'three';

export class BackgroundShader {
  public mesh: THREE.Mesh;
  public material: THREE.ShaderMaterial;

  constructor(scene: THREE.Scene) {
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0); // full screen quad
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
          // Subtle scanline / dither effect
          float scanline = sin(vUv.y * 800.0) * 0.02;
          gl_FragColor = vec4(vec3(0.09) - scanline, 1.0); // #171717 ish
        }
      `,
      depthWrite: false,
      depthTest: false
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    // Render behind everything
    this.mesh.renderOrder = -1;
    scene.add(this.mesh);
  }

  public update(time: number): void {
    this.material.uniforms.time.value = time;
  }
}
