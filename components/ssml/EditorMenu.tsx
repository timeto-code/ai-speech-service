import MenuButton from "./MenuButton";

interface Props {
  handleSynthesis: () => void;
  handlePlay: () => void;
  handleDelete: () => void;
}

const EditorMenu = ({ handleSynthesis, handlePlay, handleDelete }: Props) => {
  return (
    <div className="flex items-center justify-end gap-3 flex-1">
      <div className="flex items-center gap-2">
        <MenuButton label="合成" onClick={handleSynthesis} />
        <MenuButton label="播放" onClick={handlePlay} />
      </div>
      <div className="w-[1px] h-5 bg-zinc-500/50" />
      <MenuButton label="删除" className="hover:text-red-600" onClick={handleDelete} />
    </div>
  );
};

export default EditorMenu;
