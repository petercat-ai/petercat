// import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar, Button, Link } from '@nextui-org/react';
import useUser from '../app/hooks/useUser';

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <Button as={Link} color="primary" href="http://127.0.0.1:8000/api/auth/login" variant="flat">
        Login
      </Button>
    );
  }

  return (<Avatar size="sm" src={user.picture!} alt={user.name!} />);
}
