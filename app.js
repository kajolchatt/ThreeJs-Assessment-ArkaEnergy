class Polygon {
  constructor(vertices) {
    this.vertices = vertices;
    this.color = this.getColor();
    this.edgeColor = "#000000";
    this.mesh = this.createMesh();
  }

  getColor() {
    let color = "#FFE933";
    return color;
  }

  createMesh() {
    const shape = new THREE.Shape();
    this.vertices.forEach((v, i) => {
      if (i === 0) {
        shape.moveTo(v.x, v.y);
      } else {
        shape.lineTo(v.x, v.y);
      }
    });
    shape.lineTo(this.vertices[0].x, this.vertices[0].y);

    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: this.edgeColor,
    });

    edgesMaterial.linewidth = 4;
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    const group = new THREE.Group();
    group.add(mesh);
    group.add(edges);

    return group;
  }

  copy() {
    const newVertices = this.vertices.map((v) => ({ x: v.x, y: v.y }));
    return new Polygon(newVertices);
  }
}

class PolygonScene {
  constructor() {
    this.container = document.getElementById("canvas-container");
    this.scene = new THREE.Scene();

    const aspectRatio =
      this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.OrthographicCamera(
      -400 * aspectRatio,
      400 * aspectRatio,
      300,
      -300,
      1,
      1000
    );
    this.camera.position.set(0, 0, 10);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    this.vertices = [];
    this.polygons = [];
    this.copiedPolygons = [];
    this.vertexPoints = [];
    this.currentPolygon = null;
    this.isCopying = false;

    this.vertexGeometry = new THREE.SphereGeometry(3, 16, 16);
    this.vertexMaterial = new THREE.MeshBasicMaterial({ color: 0xff5833 });

    this.init();
  }

  init() {
    this.setupBackground();
    this.container.addEventListener("mousedown", (event) =>
      this.onMouseDown(event)
    );
    this.container.addEventListener("mousemove", (event) =>
      this.onMouseMove(event)
    );
    this.container.addEventListener("mouseup", () => this.onMouseUp());
    document
      .getElementById("completeBtn")
      .addEventListener("click", () => this.completePolygon());
    document
      .getElementById("copyBtn")
      .addEventListener("click", () => this.copyPolygon());
    document
      .getElementById("resetBtn")
      .addEventListener("click", () => this.resetScene());
    this.animate();
  }

  setupBackground() {
    this.renderer.setClearColor(0xffffff);

    const size = 1600;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(
      size,
      divisions,
      0x000000,
      0x000000
    );
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 0, 0);
    this.scene.add(gridHelper);
  }

  onMouseDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
    const vector = new THREE.Vector3(x, y, 0.5).unproject(this.camera);

    this.createVertex(vector.x, vector.y);

    if (this.isCopying && this.currentPolygon) {
      this.isCopying = false;
      this.currentPolygon.mesh.position.set(vector.x, vector.y, 0);
      this.copiedPolygons.push(this.currentPolygon);
      this.currentPolygon = null;
    } else {
      this.vertices.push({ x: vector.x, y: vector.y });
      this.render();
    }
  }

  createVertex(x, y) {
    if (!this.isCopying) {
      const vertex = new THREE.Mesh(this.vertexGeometry, this.vertexMaterial);
      vertex.position.set(x, y, 0);
      this.scene.add(vertex);
      this.vertexPoints.push(vertex);
    }
  }

  onMouseMove(event) {
    if (this.isCopying && this.currentPolygon) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
      const vector = new THREE.Vector3(x, y, 0.5).unproject(this.camera);
      this.currentPolygon.mesh.position.set(vector.x, vector.y, 0);
      this.render();
    }
  }

  completePolygon() {
    if (this.vertices.length > 2) {
      this.currentPolygon = new Polygon(this.vertices.slice());
      this.polygons.push(this.currentPolygon);
      this.scene.add(this.currentPolygon.mesh);
      this.vertices = [];
      this.render();
    }
  }

  copyPolygon() {
    if (this.polygons.length > 0) {
      this.isCopying = true;
      this.currentPolygon = this.polygons[this.polygons.length - 1].copy();
      this.scene.add(this.currentPolygon.mesh);
    }
  }

  resetScene() {
    for (const vertex of this.vertexPoints) {
      this.scene.remove(vertex);
    }
    this.vertexPoints = [];

    for (const polygon of this.polygons) {
      console.log("Removing original polygon:", polygon);
      this.scene.remove(polygon.mesh);
    }
    this.polygons = [];

    for (const copiedPolygon of this.copiedPolygons) {
      console.log("Removing copied polygon:", copiedPolygon);
      this.scene.remove(copiedPolygon.mesh);
    }
    this.copiedPolygons = [];
    this.vertices = [];
    this.currentPolygon = null;
    this.isCopying = false;
    this.render();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

new PolygonScene();
