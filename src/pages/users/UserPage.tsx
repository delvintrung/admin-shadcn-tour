
import { UserForm } from "./components/UserForm";
import { columns } from "./components/UserColumns";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/hooks/useUsers";
import {UserDataTable} from "@/pages/users/components/UserDataTable";

export function UsersPage() {
    const { data: users, isLoading, isError } = useGetUsers();

    if (isLoading) {
        return <div>Đang tải dữ liệu người dùng...</div>;
    }

    if (isError) {
        return <div>Lỗi khi tải dữ liệu người dùng!</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý User</h1>
                <UserForm>
                    <Button>Thêm User mới</Button>
                </UserForm>
            </div>
            <UserDataTable columns={columns} data={users || []} />
        </div>
    );
}