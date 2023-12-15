# Bresenham-Dystrik-s-Algorithm
An expansion of the Dystrik's algorithm through the implementation of a Bresenham's algorithm.

The two primary functions of this code, pathFind() and optimizedPath() are path-finding algorithms, where pathFind() finds a tile-based route and optimizedPath() finds a line-based route. The optimizedPath() function is much more refined and returns the mathematically most efficient route, while the pathFind() function is only efficient in an Up, Down, Left, and Right movement system. They both take the four arguments (startingLocationX, startingLocationY, destinationX, destinationY). The functions operate on a matrix which can be resized in the object mapSize. You can use the functions addWall() and removeWall() to edit barriers on the matrix, restricting the map. They take (tileX, tileY, direction), where the direction is "Left", "Right", "Up", or "Down". The function addConnection() creates a passageway between two points and takes the arguments (startingLocationX, startingLocationY, destinationX, destinationY). This can be used to simulate multi-floor designs. It's important to note that this creates a one-way passage, from start to end. The pathFind() function returns a 2-dimensional array, returning every tile's X and Y coordinates from the start to the end of the path. The optimizedPath() function also returns a 2-dimensional array, returning the X and Y coordinates of the points to pass through. This can be implemented by using the Pythagorean theorem to travel directly to the current point in the list and then moving on to the next one once it has been reached.
