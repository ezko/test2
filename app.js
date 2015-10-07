// MAZE

var MAT_ROWS = 12;
var MAT_COLS = 12;
var mat = [];
function populate_mat(m) {
    var i,j=0;
    for (i = 0; i < MAT_ROWS; i++) {
        m.push([]);
    }
    _.each(m,function(el) { 
        //console.log("el " + j++);
        var j;
        for (j = 0; j < MAT_COLS; j++) {
            el.push(0);
        }
    });
}

populate_mat(mat);

function print_mat2(m) {
	console.log("matrix:");
 _.each(m,function(el) { 
		var tmp = [];
		_.each(el,function(obj) {
			tmp.push(obj.dist);
		});
        console.log(tmp.concat());        
    });
}

function print_mat3(m) {
	console.log("matrix:");
 _.each(m,function(el) { 
		var tmp = [];
		_.each(el,function(obj) {
			tmp.push(obj.path);
		});
        console.log(tmp.concat());        
    });
}

function print_mat(m) {
 _.each(m,function(el) { 
        console.log(el.concat());        
    });
}
//print_mat(mat);

function inside_border(row,col) { 
    return  row >= 0 && 
            row < MAT_ROWS &&
            col >= 0 && 
            col < MAT_COLS;
}

function neighbour_cnt(m,row,col) {
    var cnt = 0;
    cnt += inside_border(row+1,col) && m[row+1][col] !== 0 ? 1 : 0; 
    cnt += inside_border(row-1,col) && m[row-1][col] !== 0 ? 1 : 0;
    cnt += inside_border(row,col+1) && m[row][col+1] !== 0 ? 1 : 0;
    cnt += inside_border(row,col-1) && m[row][col-1] !== 0 ? 1 : 0;
    return cnt;
}

function check_space(m,x,y) {
    
    var test_occupancy = m[x][y] === 0;
}

function move(row,col,dir) {
   
     if (dir < 0 || dir > 3) {
        console.log("error dir value");
        return;
    }
    
    var new_row = row;
    var new_col = col;
    
    new_row += (dir ===  0) ? 1 : 0;
    new_row += (dir ===  1) ? -1 : 0;
    
    new_col += (dir ===  2) ? 1 : 0;
    new_col += (dir ===  3) ? -1 : 0;
    //console.log("dir " + dir + " row " + row + " col " + col + " new_row " + new_row + " new_col " + new_col);
    
    return {row:new_row , col:new_col};
}

function try_direction(m,cur_pos) {
    var rand = Math.floor((Math.random() * 4) + 0);
    // down  0  row++
    // right 1  row--
    // up    2  col++
    // left  3  col--
    if (rand < 0 || rand > 3) {
        console.log("error rand value");
        return;
    }
    var test = 0;
    var found = {row:-1,col:-1,status:false};
    do {
        
        var new_pos = move(cur_pos.row,cur_pos.col,rand);
        
        if (inside_border(new_pos.row,new_pos.col)) {
            var cnt = neighbour_cnt(m,new_pos.row,new_pos.col);
            if ( cnt < 2) {
               if (m[new_pos.row][new_pos.col] === 0) {
                    m[new_pos.row][new_pos.col] = 1;
                   //console.log("break out : set " + new_pos.row + " " + new_pos.col);
                   found = {row:new_pos.row  , col:new_pos.col ,status:true}
                   break;
               } else {
                   //console.log("space occupied " + new_pos.row + " " + new_pos.col);
               }
            } else {
                //console.log("too many neighbours ");
            }
        }
        
        rand = (rand + 1) % 4;
        test++;
        
    } while(test < 4);
    return found;
}

var mat_stack = [];

function recursive_maze_gen(m,row,col) {
   
    if (mat_stack.length === 0) {
        return;
    }
        
    test = try_direction(m,{row:row,col:col});
    //draw_maze(m);
    if (test.status === true) {
        //row = test.row;
        //col = test.col;
       // print_mat(m);
        mat_stack.push({row:test.row,col:test.col});
        recursive_maze_gen(m,test.row,test.col);
    } else {
        var pop = mat_stack.pop();
        //row = pop.row;
        //col = pop.col;
        recursive_maze_gen(m,pop.row,pop.col);
    }

}

function draw_maze(m) {
    var i,j;
    for (row = 0; row < MAT_ROWS; row++) {
        for (col = 0; col < MAT_COLS; col++) {
            if (mat[row][col] === 1) {
                context.rect(col*10 , row*10, /*width, height*/10,10);
                context.fillStyle = 'black';
                context.fill();
                context.stroke();
            }
        }
    } 
}

function draw_maze2(m) {
    var i,j;
    for (row = 0; row < MAT_ROWS; row++) {
        for (col = 0; col < MAT_COLS; col++) {
            if (m[row][col].val === 1) {
				context.beginPath();
                if (m[row][col].path === 1)
					context.fillStyle = 'red' 
				else
					context.fillStyle = 'black';
				context.rect(col*10 , row*10, /*width, height*/10,10);
				
                context.fill();
                context.stroke();
            }
        }
    } 
}

var g_cur_row = 0;
var g_cur_col = 0;

function one_step_gen_maze() {
    if (mat_stack.length === 0) {
        return;
    }
    
	var pop = mat_stack.pop();
	if (mat_stack.length === 0) {
		return;
	}
	
	g_cur_row = pop.row;
    g_cur_col = pop.col;
	console.log("one step try " + g_cur_row + " " + g_cur_col);
	non_recursive_maze_gen(mat);
    draw_maze(mat);
	
	setTimeout(one_step_gen_maze, 1);    
}

function non_recursive_maze_gen(m) {
    var test;
    do {
        test = try_direction(m,{row:g_cur_row,col:g_cur_col});
        if (test.status === true) {
            
            g_cur_row = test.row;
            g_cur_col = test.col;
            mat_stack.push({row:g_cur_row,col:g_cur_col});
        } else {
            break;
        }
    } while(test.status === true);
}

var solve_maze_stack = [];

function update_maze(m)
{
	var i,j;
	for (i = 0; i < MAT_ROWS; i++)
		for (j = 0; j < MAT_COLS; j++)
			m[i][j] = m[i][j] ? {val:1,dist:0,path:0} : {val:0,dist:0,path:0};
}

function on_path(m,row,col) {	
	if (inside_border(row,col) && (m[row][col].val === 1) && (m[row][col].dist === 0)) {
		//console.log("on path " + row + " " + col);
		return true;
	}
	//console.log("!!! not on path " + row + " " + col);
	return false;
}
function solve_maze(m,row,col) {
	// for each available direction try to advance
	//console.log("solve " + row + " " + col);
	//print_mat2(m);
	if (solve_maze_stack.length === 0)
		return;
	
	if (on_path(m,row+1,col)) {
		m[row+1][col].dist = m[row][col].dist + 1;
		solve_maze_stack.push({row:row+1,col:col});
		//console.log("push " + (row + 1) + " " + col);
		solve_maze(m,row+1,col);
	}
	
	else if (on_path(m,row-1,col)) {
		m[row-1][col].dist = m[row][col].dist + 1;
		solve_maze_stack.push({row:row-1,col:col});
		//console.log("push " + (row -1) + " " + col);
		solve_maze(m,row-1,col);
	}
	
	else if (on_path(m,row,col+1)) {
		m[row][col+1].dist = m[row][col].dist + 1;
		solve_maze_stack.push({row:row,col:col+1});
		//console.log("push " + row + " " + (col+1));
		solve_maze(m,row,col+1);
	}
	
	else if (on_path(m,row,col-1)) {
		m[row][col-1].dist = m[row][col].dist + 1;
		solve_maze_stack.push({row:row,col:col-1});
		//console.log("push " + row + " " + (col-1));
		solve_maze(m,row,col-1);
	}
	else {
		var pop = solve_maze_stack.pop();
		if (solve_maze_stack.length === 0)
			return;
	
		solve_maze(m,pop.row,pop.col);
	}
}

var end_row = MAT_ROWS - 1;
var end_col = MAT_COLS - 1;

var shortest_path_stack = [{row:0,col:0}];

function on_shortest_path(m,row,col,dist) {	
	if (inside_border(row,col) && (m[row][col].val === 1) && (m[row][col].dist === dist)) {
		//console.log("on path " + row + " " + col);
		return true;
	}
	//console.log("!!! not on path " + row + " " + col);
	return false;
}

function draw_path_to(m,row,col) {
	
	m[row][col].path =1;
	
	if (row === end_row && col === end_col)
		return;
	if (shortest_path_stack.length === 0)
		return;
	
	var dist = m[row][col].dist;
	dist++;
	if (on_shortest_path(m,row+1,col,dist))
	{
		shortest_path_stack.push({row:row+1,col:col});
		draw_path_to(m,row+1,col);
	}	
	else if (on_shortest_path(m,row-1,col,dist))
	{
		shortest_path_stack.push({row:row-1,col:col});
		draw_path_to(m,row-1,col);
	}	
	else if (on_shortest_path(m,row,col+1,dist))
	{
		shortest_path_stack.push({row:row,col:col+1});
		draw_path_to(m,row,col+1);
	}
	else if (on_shortest_path(m,row,col-1,dist))
	{
		shortest_path_stack.push({row:row,col:col-1});
		draw_path_to(m,row,col-1);
	} 
	else {
		var pop = shortest_path_stack.pop();
		if (shortest_path_stack.length === 0)
			return;
		//pop = shortest_path_stack.pop();
		draw_path_to(m,shortest_path_stack[0].row,shortest_path_stack[0].col);
	}		
}

function maze_end(m) {
	var i;
	for (row = MAT_ROWS - 1 ; row >= 0 ; row-- )
		if (m[row][MAT_COLS-1].dist)
			return row;
	return "not found";
}

//console.log(maze_html({mat:mat}));
    var canvas=$("#myCanvas").get(0);
    var context = canvas.getContext('2d');


$( document ).ready(function() {
    console.log( "ready!" );
    
     // Render the underscore template and inject it after the H1
    // in our current DOM.
    $( "h1" ).after(
        //maze_html({mat:mat})
        //test_template({});
        "maze"
    );
 
    mat[0][0] = 1;
    mat_stack.push({row:0,col:0});
    //print_mat(mat);
    recursive_maze_gen(mat,0,0);
    //print_mat(mat);
    //non_recursive_maze_gen(mat);
	//one_step_gen_maze(mat);
    //print_mat(mat);
	
	//non_recursive_maze_gen(mat);
	//one_step_gen_maze(mat);
    draw_maze(mat);
	print_mat(mat);
	
	if (0) {
	//solve_maze(mat,0,0);
	update_maze(mat);
	//print_mat2(mat);
	solve_maze_stack.push({row:0,col:0});
	mat[0][0].dist = 1;
	solve_maze(mat,0,0);
	print_mat2(mat);
	end_row = mat[MAT_ROWS-1][MAT_COLS-1].val ? MAT_ROWS-1 : MAT_ROWS-2;
	
	draw_path_to(mat,0,0);
	print_mat3(mat);
	//draw_maze(mat);
	//draw_maze2(mat);
	}
});