const express = require("express");
const connectDB = require("./config/dbConnection");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
app.use(cors({
    origin: "http://localhost:3000"   // el Domain ely msmoo7 leeh ya5od elservice mn elserver
}));

const socketIo = require("socket.io");
const io = socketIo(server, {cors:{origin:"http://localhost:3000"}});


const routes = require("./routes");
app.use(express.json());

app.use(express.static("images")); // 3shan lma aft7 img, ya5od ellink mn elfolder da

app.use(routes);

require("dotenv").config();

connectDB();

io.onlineUsers = {} // Global, 3la mstwa elApp kolo

// Note: you can write socket.emit("" , (data) , { CB fun })

io.on("connection" , (socket)=>{
    console.log("new user connected");
    socket.on("joinMeInNotifiRoom" , id=>{
        socket.join(id);   // lma el socket(client) y3ml connection, d5lo Room 5asa beeh tgelo 3leha el Notifications
        //console.log("joined" , id);
    });

    socket.on("sendNewFReq" , (user1,user2)=>{
        console.log(user1,user2);
        io.to(user2._id).emit("newFReq" , {name:user1.username, id:user1.id}); // el Room bta3 elUser ely etb3tlo Add
    });

    socket.on("acceptFReq" , (user1,user2)=>{
        io.to(user2._id).emit("acceptFReqNotifi" , {name:user1.username, id:user1.id} );
    });

    socket.on("goOnline" , (id)=>{
        io.onlineUsers[id] = true; // elOnline Users kolohom , 3nd elServer bs
        io.emit("newOneOnline", new Date().toISOString()+id); // eb2a e3mlha broadcat lel friends bs, msh global io socket io.to().emit()
        socket.on("disconnect" , ()=>{
            io.onlineUsers[id] = false;
            io.emit("offline" , new Date().toISOString()+id); // leh 3amel el id kda ? 
            // -- mzwd 3leh el current data 3shan yb2a unique, 3shan lma a7oto fe elState fe elReact Component ,
            // kol mra yb2a b value gdeda, fa koll mra elState tb2a mo5tlfa, fa kol mra y7sl ReRender lel component = RealTime
                                              
        })
    });

    socket.on("getOnlineFriends" , friends=>{
        //console.log("friends --> " , friends);
        let onlineFr = friends.filter(f=> io.onlineUsers[f.id]);
        socket.emit("onlineUsers" , onlineFr);
    })
    //console.log( "online users : " , io.onlineUsers);

    //-------- Chat --------
    socket.on("joinChatRoom", (chatId)=>{
        socket.join(chatId);
    });
    socket.on("sendMssg" , (mssg)=>{
        io.to(mssg.chat).emit("newMssgNotifi" , mssg);
    })

    // Note: you can write socket.emit("" , (data) , { CB fun })
});
 



const PORT = process.env.PORT || 9000;
server.listen(PORT , ()=>{console.log("Server is Running ..")});