import { Avatar, Button, Link } from '@nextui-org/react';
// import useUser from '../app/hooks/useUser';

export default function Profile() {
  // const { data: user } = useUser();
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  
  // if (!user) {
    return (
      <Button as={Link} color="primary" href={`${apiDomain}/api/auth/login`} variant="flat">
        Login
      </Button>
    );
  // }

  // return (<Avatar size="sm" src={user.picture!} alt={user.name!} />);
}
