import { Button } from '@mui/material';
import { Plus } from 'lucide-react';

export const FloatingAddButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    onClick={onClick}
    variant="contained"
    color="primary"
    sx={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      borderRadius: '50%',
      width: 56,
      height: 56,
      minWidth: 0,
      padding: 0,
      boxShadow: 3,
      '&:hover': {
        boxShadow: 6,
      },
    }}
  >
    <Plus size={24} />
  </Button>
);
