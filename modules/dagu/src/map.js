let map = {

    canvas: null,

    context: null,

    horizontal_count: null,

    cell_size: null,

    cached_chunks: [],

    render: function(){
        if(map_render_locked){
            return;
        }
        util.resetCanvas();
        map.canvas = document.getElementById('map');
        map.context = map.canvas.getContext('2d');
        map.cell_size = Math.floor(map.canvas.height / game.settings.zoom_factor);

        map.horizontal_count = 3;
        while(((map.horizontal_count+2) * map.cell_size) < map.canvas.width){
            map.horizontal_count += 2;
        }

        for(let i = 0; i < game.settings.zoom_factor+1; i++){
            for(let j = 0; j < map.horizontal_count+2; j++){
                map.updateTile(i, j);
                map.updateNPC(i, j);
                map.updateObject(i, j);
            }
        }

        if(game.character.isFacingRight){
            map.context.drawImage(MAP_ICONS.HERO, ((((map.horizontal_count - 1) / 2)) * map.cell_size), ((((game.settings.zoom_factor - 1) / 2)) * map.cell_size), map.cell_size, map.cell_size);
        }else{
            map.context.drawImage(MAP_ICONS.HERO_FLIPPED, ((((map.horizontal_count - 1) / 2)) * map.cell_size), ((((game.settings.zoom_factor - 1) / 2)) * map.cell_size), map.cell_size, map.cell_size);
        }

        $('#character_health_bar_red').css('width',((game.character.current_health / util.characterStats.max_health()) * 100.0) + '%');
        $('#character_health_bar_text').text('Health: (' + game.character.current_health + '/' + util.characterStats.max_health() + ')');
        $('#character_mana_bar_blue').css('width',((game.character.current_mana / util.characterStats.max_mana()) * 100.0) + '%');
        $('#character_mana_bar_text').text('Mana: (' + game.character.current_mana + '/' + util.characterStats.max_mana() + ')');
    },

    indexToCoordinate: function(i, j){
        return {
            x: game.character.x - ((map.horizontal_count - 1) / 2) + j,
            y: game.character.y  + ((game.settings.zoom_factor - 1) / 2) - i,
        };
    },

    updateTile: function(i, j){
        let point = map.indexToCoordinate(i, j);
        let map_entry = map.get(point.x, point.y);
        if(map_entry.tile == null){
            game_logic.generateChunk(util.getChunk(point.x, point.y).x,util.getChunk(point.x, point.y).y);
        }
        map_entry = map.get(point.x, point.y);

        if(game.status === STATUS.COMBAT_ATTACK_SELECTED){
            map.context.globalAlpha = ATTACK_SELECTED_OPACITY;
        }

        map.context.drawImage(util.tileToImage(map_entry.tile), j * map.cell_size, i * map.cell_size, map.cell_size, map.cell_size);

        if(game.status === STATUS.COMBAT_ATTACK_SELECTED){
            map.context.globalAlpha = 1.0;
        }
    },

    updateNPC: function(i, j){
        let point = map.indexToCoordinate(i, j);
        let map_entry = map.get(point.x, point.y);
        if(map_entry.npc != null){

            let image;
            if(map_entry.npc.type === 'monster'){
                if(point.x > game.character.x){
                    image = monsters.getMonster(map_entry.npc.name).icon_flipped;
                }else{
                    image = monsters.getMonster(map_entry.npc.name).icon;
                }
            }else{
                if(point.x > game.character.x){
                    image = MAP_ICONS.NPCS_FLIPPED[map_entry.npc.icon];
                }else{
                    image = MAP_ICONS.NPCS[map_entry.npc.icon];
                }
            }

            if(game.status === STATUS.COMBAT_ATTACK_SELECTED){
                if(map_entry.npc.type !== 'monster' || util.distanceBetween(game.character.x,game.character.y,point.x,point.y) > character_attack.getAttack(game.selected_attack).range){
                    map.context.globalAlpha = ATTACK_SELECTED_OPACITY;
                }
            }
            map.context.drawImage(image, j * map.cell_size, i * map.cell_size, map.cell_size, map.cell_size);
            if(game.status === STATUS.COMBAT_ATTACK_SELECTED){
                map.context.globalAlpha = 1.0;
            }

            if(map_entry.npc.type === 'monster'){
                map.context.fillStyle = '#9099A2';
                map.context.fillRect(j * map.cell_size, ((i+1) * map.cell_size), Math.floor(map.cell_size / 10.0), map.cell_size);
                map.context.fillStyle = 'red';
                map.context.fillRect(j * map.cell_size, ((i+1) * map.cell_size) - (Math.floor(map.cell_size)/10.0), Math.floor((map.cell_size * (map_entry.npc.current_health / map_entry.npc.max_health))), map.cell_size);
            }
        }
    },

    updateObject: function(i, j){
        let point = map.indexToCoordinate(i, j);
        let map_entry = map.get(point.x, point.y);

        if(map_entry.object != null){
            if(game.status === STATUS.COMBAT_ATTACK_SELECTED){
                map.context.globalAlpha = ATTACK_SELECTED_OPACITY;
            }

            map.context.drawImage(util.objectToImage(map_entry.object), j * map.cell_size, i * map.cell_size, map.cell_size, map.cell_size);

            if(game.status === STATUS.COMBAT_ATTACK_SELECTED){
                map.context.globalAlpha = 1.0;
            }
        }
    },

    get: function(x, y){
        x = Math.floor(x);
        y = Math.floor(y);
        let chunk_x = util.getChunk(x,y).x;
        let chunk_y = util.getChunk(x,y).y;
        let chunk = map.getChunk(chunk_x,chunk_y);

        for(let i = 0; i < chunk.points.length; i++){
            if(chunk.points[i].x === x && chunk.points[i].y === y){
                return chunk.points[i].data;
            }
        }
    },

    getAll: function(){
        let ans = [];
        for(let i = 0; i < game.chunks.length; i++){
            if(game.chunks[i].points[0].data.tile != null){
                for(let j = 0; j < game.chunks[i].points.length; j++){
                    ans.push({
                        x:game.chunks[i].points[j].x,
                        y:game.chunks[i].points[j].y,
                    });
                }
            }
        }
        return ans;
    },

    getChunk: function(chunk_x,chunk_y){
        for(let i = 0; i < map.cached_chunks.length; i++){
            let k = map.cached_chunks[i];
            if(game.chunks[k].x === chunk_x && game.chunks[k].y === chunk_y){
                return game.chunks[k];
            }
        }

        for(let i = 0; i < game.chunks.length; i++){
            if(game.chunks[i].x === chunk_x && game.chunks[i].y === chunk_y){
                if(map.cached_chunks.length < CACHED_CHUNKS){
                    map.cached_chunks.push(i);
                }else{
                    map.cached_chunks.unshift(i);
                    map.cached_chunks.pop();
                }
                return game.chunks[i];
            }
        }

        let chunk = {
            x:chunk_x,
            y:chunk_y,
            points:[],
        };

        for(let i = CHUNK_SIZE*chunk_x; i < CHUNK_SIZE*(chunk_x+1); i++){
            for(let j = CHUNK_SIZE*chunk_y; j < CHUNK_SIZE*(chunk_y+1); j++){
                chunk.points.push({
                    x:i,
                    y:j,
                    data:{},
                });
            }
        }

        game.chunks.push(chunk);
        return game.chunks[game.chunks.length-1];
    },
};