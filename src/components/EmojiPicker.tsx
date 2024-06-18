import EmojiPicker, {
	EmojiClickData,
	EmojiStyle,
	SkinTones,
	Theme,
} from "emoji-picker-react";
import { useState } from "react";

const Emoji = ({
	setText,
	textareaRef,
	emojiOpen,
}: {
	setText: React.Dispatch<React.SetStateAction<string>>;
	textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
	emojiOpen: boolean;
}) => {
	const [defaultSkinTone, setDefaultSkinTone] = useState(SkinTones.NEUTRAL);

	const handleEmojiClick = (emojiData: EmojiClickData) => {
		if (textareaRef) {
			const textarea = textareaRef.current;
			const selectionStart = textarea?.selectionStart as number;
			const selectionEnd = textarea?.selectionEnd as number;

			// Create a new string with the emoji inserted
			textarea?.focus();
			const newText = [
				textarea?.value.substring(0, selectionStart),
				emojiData?.emoji,
				textarea?.value.substring(selectionEnd),
			].join("");

			textarea!.value = newText;
			setText(newText);
		}
	};

	return (
		<div className="absolute bottom-16 right-0">
			<EmojiPicker
				open={emojiOpen}
				theme={Theme.DARK}
				emojiStyle={EmojiStyle.APPLE}
				onEmojiClick={handleEmojiClick}
				lazyLoadEmojis
				onSkinToneChange={(skinTone) => setDefaultSkinTone(skinTone)}
				defaultSkinTone={defaultSkinTone}
			/>
		</div>
	);
};

export default Emoji;
