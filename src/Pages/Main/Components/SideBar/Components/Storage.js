import { NavigationHeaderIcon } from '../style'
import StorageIcon from '../icons/StorageIcon'
import WithToggleNavigationItem from './withToggleNavigationItem'
import angleIcon from '@/Icons/angleIcon'
import Icon from '@Components/Components/Icon'

const Storage = () => {
  return (
    <WithToggleNavigationItem id="Хранилище">
      {({ isDisplayed, toggleDisplayedFlag }) => (
        <div className="px-2 mb-4">
          <button
            className="flex items-center w-full "
            onClick={toggleDisplayedFlag}
          >
            <NavigationHeaderIcon icon={StorageIcon} size={22} />
            <span className="font-size-12 mr-auto font-medium">Хранилище</span>
            <Icon
              icon={angleIcon}
              size={10}
              className={`ml-1 ${isDisplayed ? '' : 'rotate-180'}`}
            />
          </button>
          //TODO раздел в разработке
          {/*{isDisplayed && (*/}
          {/*  <>*/}
          {/*    <WithToggleNavigationItem id='Хранилище_Строительство ПС "Красково"'>*/}
          {/*      {({ isDisplayed, toggleDisplayedFlag }) => (*/}
          {/*        <div className="font-size-12 mt-2 pl-2">*/}
          {/*          <button*/}
          {/*            type="button"*/}
          {/*            className="flex w-full py-1.5"*/}
          {/*            onClick={toggleDisplayedFlag}*/}
          {/*          >*/}
          {/*            <span className="mr-auto overflow-hidden mr-1 text-ellipsis whitespace-nowrap">*/}
          {/*              Строительство ПС "Красково"*/}
          {/*            </span>*/}
          {/*            <Icon*/}
          {/*              icon={angleIcon}*/}
          {/*              size={10}*/}
          {/*              className={`ml-1 color-text-secondary ${*/}
          {/*                isDisplayed ? '' : 'rotate-180'*/}
          {/*              }`}*/}
          {/*            />*/}
          {/*          </button>*/}
          {/*          {isDisplayed && (*/}
          {/*            <WithToggleNavigationItem id="Архив_Исходно-разрешительная доку...">*/}
          {/*              {({ isDisplayed, toggleDisplayedFlag }) => (*/}
          {/*                <div className="font-size-12 mt-2 pl-2">*/}
          {/*                  <button*/}
          {/*                    type="button"*/}
          {/*                    className="flex w-full py-1.5"*/}
          {/*                    onClick={toggleDisplayedFlag}*/}
          {/*                  >*/}
          {/*                    <span className="mr-auto overflow-hidden text-ellipsis whitespace-nowrap">*/}
          {/*                      Исходно-разрешительная документация*/}
          {/*                    </span>*/}
          {/*                    <Icon*/}
          {/*                      icon={angleIcon}*/}
          {/*                      size={10}*/}
          {/*                      className={`ml-1 color-text-secondary ${*/}
          {/*                        isDisplayed ? '' : 'rotate-180'*/}
          {/*                      }`}*/}
          {/*                    />*/}
          {/*                  </button>*/}
          {/*                  {isDisplayed && (*/}
          {/*                    <div className="font-size-12 mt-2 pl-2">*/}
          {/*                      <button*/}
          {/*                        type="button"*/}
          {/*                        className="flex w-full py-1.5"*/}
          {/*                      >*/}
          {/*                        <span className="mr-auto overflow-hidden mr-1 text-ellipsis whitespace-nowrap">*/}
          {/*                          Технические требования*/}
          {/*                        </span>*/}
          {/*                        <span className="font-medium">23</span>*/}
          {/*                        <span className="color-text-secondary">*/}
          {/*                          /45*/}
          {/*                        </span>*/}
          {/*                      </button>*/}
          {/*                    </div>*/}
          {/*                  )}*/}
          {/*                </div>*/}
          {/*              )}*/}
          {/*            </WithToggleNavigationItem>*/}
          {/*          )}*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    </WithToggleNavigationItem>*/}
          {/*    <WithToggleNavigationItem id="Хранилище_Строительство больницы">*/}
          {/*      {({ isDisplayed, toggleDisplayedFlag }) => (*/}
          {/*        <div className="font-size-12 mt-2 pl-2">*/}
          {/*          <button*/}
          {/*            type="button"*/}
          {/*            className="flex w-full py-1.5"*/}
          {/*            onClick={toggleDisplayedFlag}*/}
          {/*          >*/}
          {/*            <span className="mr-auto overflow-hidden mr-1 text-ellipsis whitespace-nowrap">*/}
          {/*              Строительство больницы*/}
          {/*            </span>*/}
          {/*            <Icon*/}
          {/*              icon={angleIcon}*/}
          {/*              size={10}*/}
          {/*              className={`ml-1 color-text-secondary ${*/}
          {/*                isDisplayed ? '' : 'rotate-180'*/}
          {/*              }`}*/}
          {/*            />*/}
          {/*          </button>*/}
          {/*          {isDisplayed && (*/}
          {/*            <WithToggleNavigationItem id="Хранилище_Строительство больницы_Исходно-разрешительная доку">*/}
          {/*              {({ isDisplayed, toggleDisplayedFlag }) => (*/}
          {/*                <div className="font-size-12 mt-2 pl-2">*/}
          {/*                  <button*/}
          {/*                    type="button"*/}
          {/*                    className="flex w-full py-1.5"*/}
          {/*                    onClick={toggleDisplayedFlag}*/}
          {/*                  >*/}
          {/*                    <span className="mr-auto overflow-hidden mr-1 text-ellipsis whitespace-nowrap">*/}
          {/*                      Исходно-разрешительная документация*/}
          {/*                    </span>*/}
          {/*                    <Icon*/}
          {/*                      icon={angleIcon}*/}
          {/*                      size={10}*/}
          {/*                      className={`ml-1 color-text-secondary ${*/}
          {/*                        isDisplayed ? '' : 'rotate-180'*/}
          {/*                      }`}*/}
          {/*                    />*/}
          {/*                  </button>*/}
          {/*                  {isDisplayed && (*/}
          {/*                    <div className="font-size-12 mt-2 pl-2">*/}
          {/*                      <button*/}
          {/*                        type="button"*/}
          {/*                        className="flex w-full py-1.5"*/}
          {/*                      >*/}
          {/*                        <span className="mr-auto overflow-hidden mr-1 text-ellipsis whitespace-nowrap">*/}
          {/*                          Технические требования*/}
          {/*                        </span>*/}
          {/*                        <span className="font-medium">23</span>*/}
          {/*                        <span className="color-text-secondary">*/}
          {/*                          /45*/}
          {/*                        </span>*/}
          {/*                      </button>*/}
          {/*                    </div>*/}
          {/*                  )}*/}
          {/*                </div>*/}
          {/*              )}*/}
          {/*            </WithToggleNavigationItem>*/}
          {/*          )}*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    </WithToggleNavigationItem>*/}
          {/*  </>*/}
          {/*)}*/}
        </div>
      )}
    </WithToggleNavigationItem>
  )
}

export default Storage
