import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar, Button, Link } from '@nextui-org/react';

export default function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <Button as={Link} color="primary" href="/api/auth/login" variant="flat">
        Login
      </Button>
    );
  }

  return (<Avatar size="sm" src={user.picture!} alt={user.name!} />);
}
