import { BitField } from '@sapphire/bitfield';

export const PermissionFlags = {
	// Posts
	CreatePost: 1 << 0,
	ManagePost: 1 << 1,

	// User
	ManageUser: 1 << 2
};

export const PermissionsBitField = new BitField(PermissionFlags);
