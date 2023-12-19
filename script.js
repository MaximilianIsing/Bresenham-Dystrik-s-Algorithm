let mapSize = {
  X: 1000,
  Y: 1000
}




walls = [[]]

function getCollisions(startX, startY, endX, endY) {

  slope = ((endY - startY)/(endX - startX))
  yIntercept = startY - slope*startX
  equation = (x) => x*slope + yIntercept


  collisions = []
  if(endX>startX){
    //right
    if(slope>=0){
      for(let x = startX; x<=endX; x++){
        sideOffset = 0.5
        startingOffset = 0
        if(x==startX){
          startingOffset = 0.5
        }
        endingOffset = 0
        if(x==endX){
          endingOffset = -0.5
        }
        for(let y = Math.floor(equation(x-sideOffset+startingOffset)+0.5);y<=Math.floor(equation(x+sideOffset+endingOffset)+0.5);y++){
          collisions.push([x,Math.round(y)])
        }
      }
    }else{



      for(let x = startX; x<=endX; x++){
        sideOffset = 0.5
        startingOffset = 0
        if(x==startX){
          startingOffset = 0.5
        }
        endingOffset = 0
        if(x==endX){
          endingOffset = -0.5
        }
        for(let y = Math.ceil(equation(x-sideOffset+startingOffset)-0.5);y>=Math.ceil(equation(x+sideOffset+endingOffset)-0.5);y--){
          collisions.push([x,Math.round(y)])
        }
      }

    }


  }else if(endX<startX){
    //left
    collisions = getCollisions(endX,endY,startX,startY)
    collisions.reverse()
  }else{
    //center
    if(endY>startY){
      //up

      for(let y = startY; y<=endY; y++){
        collisions.push([startX,y])
      }

    }else{
      //down

      for(let y = startY; y>=endY; y--){
        collisions.push([startX,y])
      }

    }

  }
  //collisions.shift()
  return collisions
}



previousCollisionOffset = [
  [[2,1],[1],[0,1]], //Left
  [[2],null,[0]], //Center
  [[2,3],[3],[0,3]] //Right
]

function isLineClear(startX, startY, endX, endY) {
  if(startX==endX&&startY==endY){
    return true
  }

  lineCollisions = getCollisions(startX, startY, endX, endY)

  for (let tile = 0; tile < lineCollisions.length; tile++) {
    if (tile == 0) {
      continue
    }

    differenceX = lineCollisions[tile][0] - lineCollisions[tile - 1][0],
    differenceY = lineCollisions[tile][1] - lineCollisions[tile - 1][1]
    collidedWalls = previousCollisionOffset[differenceX+1][differenceY+1]
    for(let wall = 0; wall < collidedWalls.length; wall++) {
      if(checkIfWallExists(lineCollisions[tile][0], lineCollisions[tile][1],collidedWalls[wall])){
        return false
      }
    }
  }
  return true
}


function hasTakenConnection(startX, startY, endX, endY) {
  return Math.sqrt((endX-startX)**2 + (endY-startY)**2)>1

}



function optimizedPath(startingX, startingY, destinationX, destinationY){
  pathToCheck = pathFind(startingX,startingY,destinationX,destinationY)

  if(!pathToCheck){
    return false //destionation is unreachable
  }

  pathToCheck.unshift([startingX,startingY])

  toReturn = []

  preIterator = 0
  iterator = 1


  while(iterator < pathToCheck.length){


    isClear = isLineClear(
      pathToCheck[preIterator][0],
      pathToCheck[preIterator][1],
      pathToCheck[iterator][0],
      pathToCheck[iterator][1]
      )


    if(iterator<pathToCheck.length-1){


      if(hasConnections(pathToCheck[iterator][0],pathToCheck[iterator][1])&&isClear&&hasTakenConnection(pathToCheck[iterator][0],pathToCheck[iterator][1],pathToCheck[iterator+1][0],pathToCheck[iterator+1][1])){
        toReturn.push([pathToCheck[preIterator],pathToCheck[iterator]])
        preIterator = iterator + 1
        iterator = preIterator
        if(iterator>pathToCheck.length-1){
          toReturn.push([pathToCheck[preIterator],[destinationX,destinationY]])
          return toReturn
        }
        continue
      }

    }else{
      if(isClear){
        toReturn.push([pathToCheck[preIterator],[destinationX,destinationY]])
        return toReturn
      }else{
        toReturn.push([pathToCheck[preIterator],pathToCheck[iterator-1]])
        toReturn.push([pathToCheck[iterator-1],pathToCheck[iterator]])
        return toReturn
      }
    }




    if(isClear){
      //line works
      iterator++
    }else{
      //line doesnt work
      toReturn.push([pathToCheck[preIterator],pathToCheck[iterator-1]])
      preIterator = iterator-1
    }

  }
  return toReturn
}




directionChange = { Top: 0, Right: 1, Bottom: 2, Left: 3, top: 0, right: 1, bottom: 2, left: 3 }
function wallCordinates(tileX, tileY, direction) { //Extremely time efficent, much better than if statements
  if (typeof direction == "string") {
    direction = directionChange[direction]
  }
  switch (direction) {
    case 0:
      return [(2 * tileX) + 1, tileY]
    case 1:
      return [(2 * tileX) + 2, tileY]
    case 2:
      return [(2 * tileX) + 1, tileY+1]
    case 3:
      return [2 * tileX, tileY]
  }
  return
}



function addWall(tileX, tileY, direction) {
  wallCords = wallCordinates(tileX,tileY,direction)
  if(walls[wallCords[0]]){
    if(walls[wallCords[0]][wallCords[1]]){
        return
    }
    walls[wallCords[0]][wallCords[1]] = true
    return
  }
  walls[wallCords[0]]= []
  walls[wallCords[0]][wallCords[1]] = true
  return
}



function removeWall(tileX, tileY, direction) {
  if(checkIfWallExists(tileX,tileY,direction)){
    wallCords = wallCordinates(tileX,tileY,direction)
    walls[wallCords[0]][wallCords[1]] = false
  }
  return
}



function checkIfWallExists(tileX, tileY, direction){
  wallCords = wallCordinates(tileX,tileY,direction)
  if(walls[wallCords[0]]){
    return walls[wallCords[0]][wallCords[1]] == true
  }
  return false
}



function isOutOfBounds(tileX, tileY){
  return tileX < 0 || tileX > mapSize.X || tileY < 0 || tileY > mapSize.Y
}

connections = []



function addConnection(fromX,fromY,toX,toY){
  if(connections[fromX]){
    if(connections[fromX][fromY]){
      connections[fromX][fromY].push([toX,toY])
      return
    }
    connections[fromX][fromY] = [[toX,toY]]
    return
  }
  connections[fromX] = []
  connections[fromX][fromY] = [[toX,toY]]
  return
}

function removeConnection(tileX,tileY){
  if(hasConnections(tileX,tileY)){
    connections[tileX][tileY] = false
  }
  return
}

function clearWalls(){
  walls = [[]]
  return
}

function clearConnections(){
  connections = [[]]
  return
}


function hasConnections(tileX,tileY){
  if(connections[tileX]){
    if(connections[tileX][tileY]){
      return true
    }
    return false
  }
  return false
}

directionOffset = [
[0,-1], //Up
[1,0], //Right
[0,1], //Down
[-1,0] //Left
]

function pathFind(startingX, startingY, destinationX, destinationY){
  if(startingX==destinationX && startingY==destinationY){
    return true
  }

  expanding = [[startingX,startingY]]
  found = []

  //found[x][y] = [fromX, fromY]
  if(found[startingX]){
    found[startingX][startingY] = true //only exception
  } else {
    found[startingX] = []
    found[startingX][startingY] = true
  }

  while(true){

    toSplice = expanding.length

    for(let expand = 0; expand<toSplice; expand++){
      for(let direction = 0;direction<=3;direction++){
        if(checkIfWallExists(expanding[expand][0],expanding[expand][1],direction)){
          continue //there is a wall
        }
        //there isn't a wall
        newTileCordinates = [
          expanding[expand][0]+directionOffset[direction][0],
          expanding[expand][1]+directionOffset[direction][1]
        ]

        if(hasConnections(expanding[expand][0],expanding[expand][1])){
          for(let c = 0; c < connections[expanding[expand][0]][expanding[expand][1]].length; c++){


            if(found[connections[expanding[expand][0]][expanding[expand][1]][c][0]]){
              if(found[connections[expanding[expand][0]][expanding[expand][1]][c][0]][connections[expanding[expand][0]][expanding[expand][1]][c][1]]){
                continue //tile has been reached
              }
              found[connections[expanding[expand][0]][expanding[expand][1]][c][0]][connections[expanding[expand][0]][expanding[expand][1]][c][1]] = [expanding[expand][0],expanding[expand][1]]
            } else {
              found[connections[expanding[expand][0]][expanding[expand][1]][c][0]] = [] // y series doesn't exist
              found[connections[expanding[expand][0]][expanding[expand][1]][c][0]][connections[expanding[expand][0]][expanding[expand][1]][c][1]] = [expanding[expand][0],expanding[expand][1]]
            }

            if(connections[expanding[expand][0]][expanding[expand][1]][c][0]==destinationX && connections[expanding[expand][0]][expanding[expand][1]][c][1]==destinationY){
              currentX = connections[expanding[expand][0]][expanding[expand][1]][c][0]
              currentY = connections[expanding[expand][0]][expanding[expand][1]][c][1]
              solution = []
              while(found[currentX][currentY] != true){
                solution.push([currentX,currentY])
                middleMan = currentX
                currentX = found[currentX][currentY][0]
                currentY = found[middleMan][currentY][1]
              }
              return solution.reverse()
            } //the connection(s) are the destination

            expanding.push(connections[expanding[expand][0]][expanding[expand][1]][c])
          }
        }


        if(isOutOfBounds(newTileCordinates[0],newTileCordinates[1])){
          continue // skip iteration if out of bounds
        }
        if(found[newTileCordinates[0]]){
          if(found[newTileCordinates[0]][newTileCordinates[1]]){
            continue //tile has been reached
          }
          found[newTileCordinates[0]][newTileCordinates[1]] = [expanding[expand][0],expanding[expand][1]]
        } else {
          found[newTileCordinates[0]] = [] // y series doesn't exist
          found[newTileCordinates[0]][newTileCordinates[1]] = [expanding[expand][0],expanding[expand][1]]
        }


        if(newTileCordinates[0]==destinationX && newTileCordinates[1]==destinationY){
          currentX = newTileCordinates[0]
          currentY = newTileCordinates[1]
          solution = []
          while(found[currentX][currentY] != true){
            solution.push([currentX,currentY])
            middleMan = currentX
            currentX = found[currentX][currentY][0]
            currentY = found[middleMan][currentY][1]
          }
          return solution.reverse()
        }
        expanding.push(newTileCordinates)
      }
    }

    if(expanding.length==0){
      return false
    }
    expanding.splice(0,toSplice)

  }

}
