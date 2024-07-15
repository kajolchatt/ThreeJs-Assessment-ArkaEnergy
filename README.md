**README.md**
================================

### PolygonScene

The `PolygonScene` class is a JavaScript application that allows users to draw polygons in a 3D space. The scene includes features such as grid lines, vertex points, and polygon rendering. Users can 
interact with the scene by clicking and dragging to create new vertices and complete or copy existing polygons.

### Features

*   **Grid Lines**: A grid system is implemented using the `THREE.GridHelper` class. This provides a helpful visual aid for users when drawing polygons.
*   **Vertex Points**: Each vertex point is represented as a 3D sphere, allowing users to easily identify and manipulate individual points.
*   **Polygon Rendering**: Completed polygons are rendered in the scene using the `THREE.MeshBasicMaterial` class. Edges of the polygon are highlighted with a thin black line for better visibility.

### Interactions

*   **Clicking and Dragging**: Users can create new vertices by clicking on the grid lines. The vertex points will follow the mouse movement as long as the left mouse button is held down.
*   **Completing Polygons**: When the user releases the mouse button, a completed polygon is formed from the vertices created. This polygon is then added to the scene and rendered with the specified 
material.
*   **Copying Polygons**: Users can copy an existing polygon by clicking on it. The copied polygon will be added to the scene as a new, separate entity.

### Resetting the Scene

The `resetScene` method allows users to reset the scene back to its initial state. This involves removing all vertex points, polygons, and copied polygons from the scene.

**How to Run the Application**

1.  Open your terminal or command prompt.
2.  Navigate to the directory where you have saved the file.
3.  Right click and open with live server.
