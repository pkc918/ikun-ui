export const inputShortcuts: Record<string, string> = {
	// input
	'k-input': 'relative fi',
	'k-input--base': 'w-full relative fi k-border border-ikun-bd-base box-border overflow-hidden',
	'k-input--inner': 'outline-none w-full flex-auto border-none text-size-inherit bg-transparent',
	'k-input--btn': 'k-reset-btn cursor-pointer',
	'k-input--inner__textarea': 'p-2 rounded bg-transparent',
	'k-input--icon': 'op50',
	'k-input--prefix-icon': 'mr-1.5',
	'k-input--suffix-icon': 'ml-1.5',
	'k-input__rounded': 'rounded',
	'k-input__rounded__left': 'rounded-l',
	'k-input__rounded__right': 'rounded-r',

	// prepend append
	'k-input--prepend': '!rounded-l !rounded-r-0',
	'k-input--append': '!rounded-r !rounded-l-0',
	'k-input--prepend__sm': 'h-22px',
	'k-input--append__sm': 'h-22px',
	'k-input--prepend__md': 'h-30px',
	'k-input--append__md': 'h-30px',
	'k-input--prepend__lg': 'h-38px',
	'k-input--append__lg': 'h-38px',

	// size
	'k-input__sm': 'h-22px px-1.5 text-12px',
	'k-input__md': 'h-30px px-2.5 text-14px',
	'k-input__lg': 'h-38px px-2.5 text-16px',

	'k-input--icon__sm': '!w-12px !h-12px',
	'k-input--icon__md': '!w-16px !h-16px',
	'k-input--icon__lg': '!w-20px !h-20px',

	'k-input__disabled': 'k-bg-disabled k-cur-disabled',
	'k-input__hover': 'hover:border-ikun-main [&:hover>.k-input--clear-icon]:block',
	'k-input__focus':
		'focus-within:border-ikun-main focus-within:k-input-shadow [&:focus-within>.k-input--clear-icon]:block',

	// clear
	'k-input--clear-icon': 'hidden k-reset-btn',

	// error
	'k-input__error': 'border-ikun-error k-input-shadow--error',

	// dark
	'k-input__dark': 'dark:bg-ikun-dark-300',
	'k-input--inner__dark': 'dark:(bg-ikun-dark-300 text-ikun-white)',
	'k-input__disabled__dark': 'dark:(bg-ikun-dark text-ikun-white)'
};
