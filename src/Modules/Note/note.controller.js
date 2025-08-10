import express from "express";
import * as noteServices from "./note.service.js";
import * as authMiddlewares from "../../Middlewares/Auth/auth.middleware.js";
import * as userMiddleware from "../../Middlewares/User/user.middleware.js";
import * as noteMiddleware from "../../Middlewares/Note/note.middleware.js";

const noteRouter = express.Router();

noteRouter.use(
  authMiddlewares.validateBanned,
  authMiddlewares.validateToken,
  userMiddleware.isUserExist
);

// 1- Create a new note
noteRouter.post("/", noteServices.createNote);

// 2- Update a single Note by its id
noteRouter.put(
  "/:noteId",
  noteMiddleware.validateOwner,
  noteServices.updateNote
);

// 3-  Replace the entire note
noteRouter.put(
  "/replace/:noteId",
  noteMiddleware.validateOwner,
  noteServices.replaceNote
);

// 4- Updates the title of all notes created by a logged-in user
noteRouter.patch("/all", noteServices.updateAllNotesTitleForUser);

// 5- Delete a single Note by its id
noteRouter.delete(
  "/:noteId",
  noteMiddleware.validateOwner,
  noteServices.deleteNoteById
);

// 6- Retrieve a paginated list of notes for the logged-in user
noteRouter.get("/paginate-sort", noteServices.getPaginatedNotes);

// 8- Get a note for logged-in user by its content.
noteRouter.get("/note-by-content", noteServices.getNoteByContent);

// 9- Retrieves all notes for the logged-in user with user information
noteRouter.get("/note-with-user", noteServices.getAllNotes);

// 10- Using aggregation, retrieves all notes for the logged-in user with user information
noteRouter.get("/aggregate", noteServices.getAllNotesWithAggregation);

// 11- Delete all notes for the logged-in user
noteRouter.delete("/", noteServices.deleteAllNotesForUser);

// 7- Get a note by its id.
noteRouter.get("/:id", noteMiddleware.validateOwner, noteServices.getNoteById);

export default noteRouter;
