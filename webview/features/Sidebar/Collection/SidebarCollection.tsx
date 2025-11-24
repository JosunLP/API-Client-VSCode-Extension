import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";

import { Headers, RequestObject } from "../../../../src/utils/type";
import Information from "../../../components/Information";
import MoreInformation from "../../../components/MoreInformation";
import { SIDEBAR } from "../../../constants";
import { calculateCollectionTime, generateMethodColor } from "../../../utils";
import SidebarDeleteAllButton from "../Button/SidebarDeleteAllButton";
import SibebarEmptyCollectionMenu from "../Menu/SidebarEmptyCollectionMenu";
import EmptySearchResultMessage from "../Message/EmptySearchResultMessage";

interface ISidebarCollectionProps {
  sidebarOption: string | null;
  userCollection: {
    url: string;
    method: string;
    headers: Headers;
    responseType: string;
    requestedTime: number;
    favoritedTime: number | null;
    isUserFavorite: boolean;
    id: string;
    requestObject: RequestObject;
  }[];
  handleUrlClick: (id: string) => void;
  handleDeleteButton: (id: string) => void;
  handleDeleteAllButton: () => void;
  handleSidebarFavoriteIcon: (stringValue: string, id: string) => void;
  handleUpdateFavoriteFolder?: (id: string, folder: string) => void;
}
const SidebarCollection = ({
  sidebarOption,
  userCollection,
  handleUrlClick,
  handleDeleteButton,
  handleDeleteAllButton,
  handleSidebarFavoriteIcon,
  handleUpdateFavoriteFolder,
}: ISidebarCollectionProps) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  return (
    <>
      {userCollection?.length ? (
        <UtilitySectionWrapper>
          <input
            type="text"
            placeholder="Search collection..."
            value={searchInputValue}
            onChange={(event) => setSearchInputValue(event.target.value)}
          />
        </UtilitySectionWrapper>
      ) : null}
      <CollectionWrapper>
        {userCollection?.length ? (
          userCollection.filter((collection) =>
            collection.url.toLowerCase().includes(searchInputValue),
          ).length !== 0 ? (
            <>
              <SidebarDeleteAllButton clickHandler={handleDeleteAllButton} />
              <CollectionDetailWrapper>
                {sidebarOption === SIDEBAR.FAVORITES
                  ? Object.entries(
                      userCollection
                        .filter((collection) =>
                          collection.url
                            .toLowerCase()
                            .includes(searchInputValue),
                        )
                        .reduce((groups, item) => {
                          const folder = item.folder || "Unassigned";
                          if (!groups[folder]) groups[folder] = [];
                          groups[folder].push(item);
                          return groups;
                        }, {} as Record<string, typeof userCollection>),
                    ).map(([folder, items]) => (
                      <div key={folder}>
                        <FolderHeader>{folder}</FolderHeader>
                        {items.map((collection) => {
                          const {
                            url,
                            method,
                            id,
                            requestedTime,
                            favoritedTime,
                            folder,
                          } = collection;
                          const methodColor = generateMethodColor(
                            method.toLowerCase(),
                          );
                          const favoriteListedTime = calculateCollectionTime(
                            favoritedTime || 0,
                          );

                          return (
                            <HistoryListWrapper key={sidebarOption + id}>
                              <Information textColor={methodColor}>
                                <div className="methodContainer">
                                  <h4>{method}</h4>
                                </div>
                                <div>
                                  <p onClick={() => handleUrlClick(id)}>
                                    {url}
                                  </p>
                                </div>
                              </Information>
                              <MoreInformation>
                                <div>
                                  <p>Added {favoriteListedTime}</p>
                                </div>
                                {handleUpdateFavoriteFolder && (
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Folder"
                                      defaultValue={folder || ""}
                                      onBlur={(e) =>
                                        handleUpdateFavoriteFolder(
                                          id,
                                          e.target.value,
                                        )
                                      }
                                      style={{
                                        background: "transparent",
                                        border: "1px solid #404040",
                                        color: "inherit",
                                        padding: "0.2rem",
                                        width: "95%",
                                      }}
                                    />
                                  </div>
                                )}
                                <div role="iconWrapper">
                                  <FaTrashAlt
                                    className="sidebarIcon"
                                    onClick={() => handleDeleteButton(id)}
                                    data-testid="delete-button"
                                  />
                                </div>
                              </MoreInformation>
                            </HistoryListWrapper>
                          );
                        })}
                      </div>
                    ))
                  : userCollection
                      .filter((collection) =>
                        collection.url.toLowerCase().includes(searchInputValue),
                      )
                      .map(
                        ({
                          url,
                          method,
                          isUserFavorite,
                          id,
                          requestedTime,
                          favoritedTime,
                        }) => {
                          const methodColor = generateMethodColor(
                            method.toLowerCase(),
                          );
                          const collectionCreatedTime =
                            calculateCollectionTime(requestedTime);
                          const favoriteListedTime = calculateCollectionTime(
                            favoritedTime || 0,
                          );

                          return (
                            <HistoryListWrapper key={sidebarOption + id}>
                              <Information textColor={methodColor}>
                                <div className="methodContainer">
                                  <h4>{method}</h4>
                                </div>
                                <div>
                                  <p onClick={() => handleUrlClick(id)}>
                                    {url}
                                  </p>
                                </div>
                              </Information>
                              <MoreInformation>
                                <div>
                                  {sidebarOption === SIDEBAR.HISTORY ? (
                                    <p>{collectionCreatedTime}</p>
                                  ) : (
                                    <p>Added {favoriteListedTime}</p>
                                  )}
                                </div>
                                <div role="iconWrapper">
                                  {sidebarOption === SIDEBAR.HISTORY ? (
                                    isUserFavorite ? (
                                      <AiFillHeart
                                        className="sidebarIcon favorite"
                                        onClick={() =>
                                          handleSidebarFavoriteIcon(
                                            SIDEBAR.REMOVE_FROM_FAVORITES,
                                            id,
                                          )
                                        }
                                      />
                                    ) : (
                                      <AiOutlineHeart
                                        className="sidebarIcon"
                                        onClick={() =>
                                          handleSidebarFavoriteIcon(
                                            SIDEBAR.ADD_TO_FAVORITES,
                                            id,
                                          )
                                        }
                                      />
                                    )
                                  ) : null}
                                  <FaTrashAlt
                                    className="sidebarIcon"
                                    onClick={() => handleDeleteButton(id)}
                                    data-testid="delete-button"
                                  />
                                </div>
                              </MoreInformation>
                            </HistoryListWrapper>
                          );
                        },
                      )}
              </CollectionDetailWrapper>
            </>
          ) : (
            <EmptySearchResultMessage value={searchInputValue} />
          )
        ) : (
          <SibebarEmptyCollectionMenu currentSidebarOption={sidebarOption} />
        )}
      </CollectionWrapper>
    </>
  );
};

const CollectionWrapper = styled.div`
  width: 100%;
`;

const CollectionDetailWrapper = styled.div`
  overflow-y: scroll;
  height: 62vh;
`;

const UtilitySectionWrapper = styled.div`
  input {
    margin-top: 1rem;
    padding: 0.4rem 0.6rem;
    border-radius: 0.35rem;
    color: var(--default-text);
    opacity: 0.78;
  }
`;

const HistoryListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.35rem 0.15rem 0.5rem 0;
  padding: 0.55rem 0.1rem 0 0.25rem;
  border-bottom: 0.07rem solid #404040;
  overflow: hidden;

  p {
    font-size: 0.92rem;
  }
`;

const FolderHeader = styled.h3`
  padding: 0.5rem 1rem;
  background-color: #252526;
  color: #cccccc;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export default SidebarCollection;
