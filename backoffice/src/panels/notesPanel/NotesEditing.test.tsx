import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteType } from "../../entities/INote";
import { NotesEditing } from "./NotesEditing";

describe("NotesEditing", () => {
  it("allows user to select a note type", async () => {
    render(<NotesEditing onSave={jest.fn()} onCancel={jest.fn()} />);

    const incidentNoteRadio = screen.getByTestId(/incident-note-type/i);
    const generalNoteRadio = screen.getByTestId(/general-note-type/i);

    await userEvent.click(incidentNoteRadio);
    await userEvent.click(generalNoteRadio);
  });

  it("user can type a note into text field", async () => {
    render(<NotesEditing onSave={jest.fn()} onCancel={jest.fn()} />);

    const noteInputField = screen.getByPlaceholderText("Add a note here");
    await userEvent.type(noteInputField, "Here is a note");

    expect(await screen.findByDisplayValue("Here is a note")).toBeVisible();
  });

  it("calls the onSave() callback to save the note", async () => {
    const onSave = jest.fn();
    render(<NotesEditing onSave={onSave} onCancel={jest.fn()} />);

    const generalNoteRadio = screen.getByTestId(/general-note-type/i);
    const noteInputField = screen.getByPlaceholderText("Add a note here");
    await userEvent.click(generalNoteRadio);
    await userEvent.type(noteInputField, "Here is a note");

    let saveButton = screen.getByTestId(/save/i);
    await waitFor(() => {
      expect(saveButton).toBeEnabled();
    });

    userEvent.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        type: NoteType.GENERAL,
        text: "Here is a note",
      });
    });
  });

  it("calls the cancel callback to abort", async () => {
    const onCancel = jest.fn();
    render(<NotesEditing onSave={jest.fn()} onCancel={onCancel} />);

    const incidentNoteRadio = screen.getByTestId(/incident-note-type/i);
    const noteInputField = screen.getByPlaceholderText("Add a note here");
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    await userEvent.click(incidentNoteRadio);
    await userEvent.type(noteInputField, "Here is a note");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it("does not allow user to submit an incomplete note", async () => {
    render(<NotesEditing onSave={jest.fn()} onCancel={jest.fn()} />);
    const noteInputField = screen.getByPlaceholderText("Add a note here");
    const generalNoteRadio = screen.getByTestId(/general-note-type/i);

    await waitFor(() => {
      expect(screen.getByTestId(/save/i)).toBeDisabled();
    });

    await userEvent.type(noteInputField, "Here is a note");

    await waitFor(() => {
      expect(screen.getByTestId(/save/i)).toBeDisabled();
    });

    await userEvent.clear(noteInputField);
    await userEvent.click(generalNoteRadio);

    await waitFor(() => {
      expect(screen.getByTestId(/save/i)).toBeDisabled();
    });
  });
});
