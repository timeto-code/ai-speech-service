import { fetchRoleList } from "@/actions/api/tts";
import { useVoiceStore } from "@/store/useVoiceStore";
import { useEffect, useState } from "react";
import Combobox from "../Combobox";

interface Props {
  isLoading: boolean;
}

const RoleCombobox = ({ isLoading }: Props) => {
  const [value, setValue] = useState<string>("All");
  const [roles, setRoles] = useState<OptionObject[]>([]);
  const voiceListRefreshed = useVoiceStore((state) => state.voiceListRefreshed);

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await fetchRoleList();
      if (res.code === 0 && res.data) {
        setRoles(res.data);
      } else {
        // 提示错误
      }
    };

    fetchRoles();
  }, [voiceListRefreshed]);

  useEffect(() => {
    useVoiceStore.setState({ role: value });
  }, [value]);

  return (
    <Combobox
      boxLabel="角色"
      options={roles}
      value={value}
      setValue={setValue}
      isLoading={isLoading}
      className="h-[366px] w-56 py-1 px-0"
    />
  );
};

export default RoleCombobox;
