import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Chip, TextField, IconButton, InputAdornment } from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserAuth } from '../../Context/Authcontext';
import { apiget, apipost, apidelete, apiput } from "../../API/Api";
 
const Comment = ({ taskid }) => {
    const [comment, setComment] = useState([]);
    const [nicknames, setNicknames] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const { user } = UserAuth();
 
    const commentload = async () => {
        try {
            const response = await apiget(`task/comment/${taskid}`);
            if (response && response.length > 0 && response[0].user_id) {
                const userid = response[0].user_id;
                const name = await apiget(`nickname/${userid}`);
                setNicknames(name);
            }
       
            const sortedResponse = response.slice().sort((a, b) => new Date(a.creationdate) - new Date(b.creationdate));
            setComment(sortedResponse);
        } catch (error) {
            console.error("Fehler beim Laden der Kommentare:", error);
        }
    };
 
    useEffect(() => {
        commentload();
    }, []);
 
    const handleCommentSubmit = async () => {
        try {
            const newcom = await apipost('comment', {
                id: 0,
                comment: newComment,
                creationdate: new Date().toISOString(),
                user_id: user.id,
                task_id: taskid,
            });
       
            setComment([...comment, newcom]);
            setNewComment("");
        } catch (error) {
            console.error("Fehler beim Hinzufügen des Kommentars:", error);
        }
    };
 
    const isCurrentUserComment = (Comment) => {
        return Comment.user_id === user.id.toString();
    };
 
    const handleEdit = (index) => {
        setEditIndex(index);
        setEditedComment(comment[index].comment);
    };
 
    const handleUpdate = async () => {
        try {
            const updatedComments = [...comment];
            updatedComments[editIndex].comment = editedComment;
            await apiput('comment' , updatedComments[editIndex].id, {
                id: updatedComments[editIndex].id,
                comment: editedComment,
                creationdate: new Date().toISOString(),
                user_id: user.id,
                task_id: taskid,
            });
            setComment(updatedComments);
            setEditIndex(null);
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Kommentars:", error);
        }
    };
 
    const handleDelete = async (index, Comment) => {
        try {
            await apidelete(`coment`, Comment.id);
            const updatedComments = comment.filter((_, i) => i !== index);
            setComment(updatedComments);
        } catch (error) {
            console.error("Fehler beim Löschen des Kommentars:", error);
        }
    };
 
    const kommentarfeld = {
        backgroundColor: "white",
        padding: "5px",
        marginBottom: "5px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    };
 
    const chipStyle = {
        marginRight: "8px",
        marginBottom: "5px",
        fontSize: "10px",
    };
 
    const creationDateStyle = {
        fontSize: "10px",
        color: "#777",
    };
 
    const editDeleteIconStyle = {
        fontSize: "10px",
    };
 
    const kommentarContainer = (Comment) => {
        if (comment.length > 3) {
            return {
                maxHeight: "300px",
                overflowY: "scroll",
                width: "100%",
                padding: "5px",
                marginBottom: "5px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflowX: "hidden",
                backgroundColor: "white",
            };
        } else {
            return {
                width: "100%",
                padding: "5px",
                marginBottom: "5px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
            };
        }
    };
 
    return (
        <>
            <Container style={kommentarContainer(Comment)}>
                {comment && comment.length > 0 ? (
                    comment.map((Comment, index) => (
                        <Box key={index} style={kommentarfeld}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Chip
                                    icon={<FaceIcon />}
                                    label={nicknames && nicknames.nickname}
                                    style={chipStyle}
                                    size="small"
                                />
                                {Comment.user_id === user.id.toString() ? (                                
                                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                                    {editIndex === index ? (
                                        <IconButton onClick={handleUpdate}>
                                            <SendIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton style={editDeleteIconStyle} onClick={() => handleEdit(index)}>
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                    )}
                                    <IconButton style={editDeleteIconStyle} onClick={() => handleDelete(index, Comment)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </div>):(<></>)}
                            </div>
                            <div style={{ flex: 1 }}>
                                {editIndex === index ? (
                                    <TextField
                                        variant="outlined"
                                        value={editedComment}
                                        onChange={(e) => setEditedComment(e.target.value)}
                                        fullWidth
                                    />
                                ) : (
                                    <Typography>{Comment.comment}</Typography>
                                )}
                                <Typography style={creationDateStyle}>{Comment.creationdate}</Typography>
                            </div>
                        </Box>
                    ))
                ) : (
                    <></>
                )}
                <Box>
                    <TextField
                        label="Neuer Kommentar"
                        variant="outlined"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        fullWidth
                        multiline
                        style={{ marginBottom: "10px" }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleCommentSubmit}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Container>
        </>
    );
};
 
export default Comment;