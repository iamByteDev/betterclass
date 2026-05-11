import {username} from 'username';
async function getUser (){
    let sessionUsername:string | undefined
    let latestsavedUser:string | undefined
    if (latestsavedUser != sessionUsername){
        sessionUsername = await username();
        latestsavedUser = sessionUsername
    }
}